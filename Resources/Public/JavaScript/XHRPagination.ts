/**
 * interface for our event listener updates
 * required if f.e. multiple pagination implementations are on a single page
 */
interface QuerySelectorElement {
    querySelectorAll(selectors: string): any
}

/**
 * interface to use in other typescript modules if required
 */
interface XhrPagination {
    // callbacks in case the pagination fails, returns text containing the error message/status
    failCallbacks: { (errorText: string): any; } [];
    // callbacks after successful pagination but before scrolling to the top of the element
    // useful f.e. if galleries aren't initialized yet and you want to initialize them before scrolling to them
    callbacksPreScroll: { (): any; } [];
    // callbacks being called after everything finished
    callbacks: { (): any; } [];

    /**
     * add the pagination click event listener to all elements of queryable element
     *
     * @param element: QuerySelectorElement
     */
    addAllPaginationEventListeners(element: QuerySelectorElement): void;

    /**
     * adds the onpopstate functionality
     * and replaces the current browser history state for history.back() functionality to main page
     */
    prepareBrowserHistoryUpdate(): void;
}

/**
 * basic functionality for asynchronous loaded pagination
 */
class XHRPagination implements XhrPagination {
    failCallbacks: { (errorText: string): any; } [];
    callbacksPreScroll: { (): any; } [];
    callbacks: { (): any; } [];

    /**
     * initialize all required variables/settings for the XHR pagination
     */
    constructor() {
        this.failCallbacks = [];
        this.callbacksPreScroll = [];
        this.callbacks = [];
    }

    /**
     * pagination functionality. loads the returned content of the next page and replaces the current
     * pagination content with the newly loaded content
     *
     * @param element: HTMLElement
     * @param content: string
     * @param saveState: boolean
     */
    private paginate(element: HTMLElement, content: string, saveState: boolean = false) {
        let replacementNode;
        if (typeof element.closest === 'function') {
            // all modern browsers
            replacementNode = element.closest('div[id^="ajax-container-"]');
        } else {
            // IE11 and Edge...
            replacementNode = this.closest(element, 'div[id^="ajax-container-"]');
        }
        if (replacementNode === null) {
            console.warn("couldn't find closest container for clicked pagination object");
            return;
        }

        let contentElement = XHRPagination.htmlToElements(content, replacementNode);
        if (contentElement) {
            if (saveState && (<HTMLElement>replacementNode).dataset.updateBrowserHistory === '1') {
                // add the current page to the history for window.back
                let stateObj = {
                    url: element.getAttribute("href"),
                    content: content,
                    containerId: replacementNode.id
                };
                window.history.pushState(stateObj, '', stateObj.url);
            }

            let parentNode = replacementNode.parentNode;
            if (parentNode === null) {
                return;
            }

            parentNode.removeChild(replacementNode);
            parentNode.appendChild(contentElement);
            // refresh our pagination event listener for the newly loaded content elements
            this.addAllPaginationEventListeners(parentNode);

            // call each callback before scrolling to the top of the new element
            this.callbacksPreScroll.forEach(function (cb) {
                cb();
            });

            // scroll to our new list start
            if ('scrollBehavior' in document.documentElement.style) {
                // smooth scrolling for all browsers supporting the scroll behaviour (all except for IE11/Edge rn)
                window.scrollTo({
                    top: (<HTMLInputElement>parentNode.querySelector('div[id="' + replacementNode.id + '"]')).offsetTop - 150,
                    behavior: 'smooth',
                });
            } else {
                // Internet Explorer 11 and Edge don't support ScrollToOptions yet, hard jump for them
                window.scrollTo(0, (<HTMLInputElement>parentNode.querySelector('div[id="' + replacementNode.id + '"]')).offsetTop - 150);
            }

            // call each callback after finishing our pagination process
            this.callbacks.forEach(function (cb) {
                cb();
            });
        } else {
            this.failCallbacks.forEach(function (cb) {
                cb("couldn't retrieve ajax container from XHR response text")
            });
        }
    }

    /**
     * Internet Explorer 11 and Edge compliant alternative to the closest selector
     *
     * @param el: HTMLElement|null
     * @param selector: string
     */
    private closest(el: HTMLElement | null, selector: string) {
        let matchesFn: any;

        // find vendor prefix
        ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
            if (typeof (<any>document.body)[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        });

        let parent;
        // traverse parents
        while (el) {
            parent = el.parentElement;
            // noinspection JSUnusedAssignment
            if (parent && (<any>parent)[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }
        return null;
    }

    /**
     * create valid HTML Element from passed html string
     *
     * @param htmlString: string
     * @param replacementNode: Element
     */
    private static htmlToElements(htmlString: string, replacementNode: Element): HTMLElement | null {
        let template = document.createElement('div');
        template.innerHTML = htmlString;
        return template.querySelector('div[id="' + replacementNode.id + '"]');
    }

    /**
     * load the response from the passed URI before paginating
     *
     * @param element: HTMLElement
     * @param uri: string
     */
    private loadNextPage(element: HTMLElement, uri: string) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', uri);
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.paginate(element, xhr.responseText, true);
            } else {
                this.failCallbacks.forEach(function (cb) {
                    cb(xhr.statusText);
                })
            }
        };
        xhr.send();
    }

    public addAllPaginationEventListeners(element: QuerySelectorElement) {
        let _this = this;

        [].slice.call(element.querySelectorAll('nav > ul a[data-ajaxuri]')).forEach(function (el: Element) {
            el.addEventListener('click', function (event: Event) {
                _this.loadNextPage(this, this.dataset.ajaxuri);
                event.preventDefault();
            });
        });
    }

    public prepareBrowserHistoryUpdate() {
        // add the current page to the history for window.back before the first XHR request
        let stateObj = {url: location.href, innerHTML: document.body.innerHTML};
        window.history.replaceState(stateObj, '', stateObj.url);

        // add a onpopstate function to parse our manipulated history states
        window.onpopstate = (event: any) => {
            if (event.state !== null) {
                if (event.state.innerHTML !== undefined) {
                    document.body.innerHTML = event.state.innerHTML;
                    this.addAllPaginationEventListeners(document);
                } else {
                    let containerElement = (<HTMLInputElement>document.querySelector('div[id="' + event.state.containerId + '"] a'));
                    this.paginate(containerElement, event.state.content, false);
                }
            }
        };
    }
}

// export default XHR pagination object
let xhrPagination = new XHRPagination();

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('[id^="ajax-container-"][data-update-browser-history="1"]') !== null) {
        xhrPagination.prepareBrowserHistoryUpdate()
    }

    // add the pagination event listener initially to all found links in the document
    xhrPagination.addAllPaginationEventListeners(document);
});