# TYPO3 Extension ``AJAX Pagination``
![GitHub](https://img.shields.io/github/license/DaRealFreak/ajax_pagination)

TYPO3 Extension providing full functionality for AJAX paginations for passed objects.

## Features
- only the related content element is rendered resulting in no performance problems
- contrary to its name the extension uses XHRequests and does not require jQuery
- option to manipulate the browser history with an additional option
- if JavaScript is disabled the pagination will still work normally

## Usage
1. You can install the extension either using composer using `composer require skeuper/ajax-pagination`  
or you can download the extension from the TYPO3 extension repository and install it with the extension manager module.
2. Include the template `AJAX Pagination (ajax_pagination)` to the included static templates.
3. Now you can change `<f:widget.paginate ... > ... </f:widget.paginate>` to `<p:widget.paginate ... > ... </p:widget.paginate>`
and everything should work already.

## Browser History Manipulation
The pagination adds the option to manipulate the browser history while paginating.  
You can simply add `updateBrowserHistory: '1'` to the passed configuration of the pagination.  
This will result in the pagination pushing states in the browser history for restoring the previous site on going back.

## Development
Want to contribute? Great!  
I'm always glad hearing about bugs or pull requests.

## License
This project is licensed under the GPL v2.0 - see the [LICENSE](LICENSE) file for details
