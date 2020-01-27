/**
 * basic functionality for asynchronous loaded pagination
 */
var XHRPagination = /** @class */ (function () {
    /**
     * initialize all required variables/settings for the XHR pagination
     */
    function XHRPagination() {
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
    XHRPagination.prototype.paginate = function (element, content, saveState) {
        if (saveState === void 0) { saveState = false; }
        var replacementNode;
        if (typeof element.closest === 'function') {
            // all modern browsers
            replacementNode = element.closest('div[id^="ajax-container-"]');
        }
        else {
            // IE11 and Edge...
            replacementNode = this.closest(element, 'div[id^="ajax-container-"]');
        }
        if (replacementNode === null) {
            console.warn("couldn't find closest container for clicked pagination object");
            return;
        }
        var contentElement = XHRPagination.htmlToElements(content, replacementNode);
        if (contentElement) {
            if (saveState && replacementNode.dataset.updateBrowserHistory === '1') {
                // add the current page to the history for window.back
                var stateObj = {
                    url: element.getAttribute("href"),
                    content: content,
                    containerId: replacementNode.id
                };
                window.history.pushState(stateObj, '', stateObj.url);
            }
            var parentNode = replacementNode.parentNode;
            if (parentNode === null) {
                console.error("parent node is null");
                return;
            }
            parentNode.removeChild(replacementNode);
            parentNode.appendChild(contentElement);
            // refresh our pagination event listener for the newly loaded content elements
            this.addAllPaginationEventListeners(parentNode);
            // scroll to our new list start
            if ('scrollBehavior' in document.documentElement.style) {
                // smooth scrolling for all browsers supporting the scroll behaviour (all except for IE11/Edge rn)
                window.scrollTo({
                    top: parentNode.querySelector('div[id="' + replacementNode.id + '"]').offsetTop - 150,
                    behavior: 'smooth'
                });
            }
            else {
                // Internet Explorer 11 and Edge don't support ScrollToOptions yet, hard jump for them
                window.scrollTo(0, parentNode.querySelector('div[id="' + replacementNode.id + '"]').offsetTop - 150);
            }
            // call each callback after finishing our pagination process
            this.callbacks.forEach(function (cb) {
                cb();
            });
        }
        else {
            console.error("couldn't retrieve ajax container from XHR response text");
        }
    };
    /**
     * Internet Explorer 11 and Edge compliant alternative to the closest selector
     *
     * @param el: HTMLElement|null
     * @param selector: string
     */
    XHRPagination.prototype.closest = function (el, selector) {
        var matchesFn;
        // find vendor prefix
        ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
            if (typeof document.body[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        });
        var parent;
        // traverse parents
        while (el) {
            parent = el.parentElement;
            // noinspection JSUnusedAssignment
            if (parent && parent[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }
        return null;
    };
    /**
     * create valid HTML Element from passed html string
     *
     * @param htmlString: string
     * @param replacementNode: Element
     */
    XHRPagination.htmlToElements = function (htmlString, replacementNode) {
        var template = document.createElement('div');
        template.innerHTML = htmlString;
        return template.querySelector('div[id="' + replacementNode.id + '"]');
    };
    /**
     * load the response from the passed URI before paginating
     *
     * @param element: HTMLElement
     * @param uri: string
     */
    XHRPagination.prototype.loadNextPage = function (element, uri) {
        var _this_1 = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', uri);
        xhr.onload = function () {
            if (xhr.status === 200) {
                _this_1.paginate(element, xhr.responseText, true);
            }
        };
        xhr.send();
    };
    /**
     * add the pagination click event listener to all elements of queryable element
     *
     * @param element: QuerySelectorElement
     */
    XHRPagination.prototype.addAllPaginationEventListeners = function (element) {
        var _this = this;
        [].slice.call(element.querySelectorAll('nav > ul a[data-ajaxuri]')).forEach(function (el) {
            el.addEventListener('click', function (event) {
                _this.loadNextPage(this, this.dataset.ajaxuri);
                event.preventDefault();
            });
        });
    };
    /**
     * adds the onpopstate functionality
     * and replaces the current browser history state for history.back() functionality to main page
     */
    XHRPagination.prototype.prepareBrowserHistoryUpdate = function () {
        var _this_1 = this;
        // add the current page to the history for window.back before the first XHR request
        var stateObj = { url: location.href, innerHTML: document.body.innerHTML };
        window.history.replaceState(stateObj, '', stateObj.url);
        // add a onpopstate function to parse our manipulated history states
        window.onpopstate = function (event) {
            if (event.state !== null) {
                if (event.state.innerHTML !== undefined) {
                    document.body.innerHTML = event.state.innerHTML;
                    _this_1.addAllPaginationEventListeners(document);
                }
                else {
                    var containerElement = document.querySelector('div[id="' + event.state.containerId + '"] a');
                    _this_1.paginate(containerElement, event.state.content, false);
                }
            }
        };
    };
    /**
     * in case your application relies on additional javascript you can register a callback
     * which registers on every pagination process
     */
    XHRPagination.prototype.addPaginateCallback = function (p) {
        this.callbacks.push(p);
    };
    return XHRPagination;
}());
// export default XHR pagination object
var xhrPagination = new XHRPagination();
document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('[id^="ajax-container-"][data-update-browser-history="1"]') !== null) {
        xhrPagination.prepareBrowserHistoryUpdate();
    }
    // add the pagination event listener initially to all found links in the document
    xhrPagination.addAllPaginationEventListeners(document);
});
