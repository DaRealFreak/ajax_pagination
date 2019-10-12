<?php

namespace SKeuper\AjaxPagination\ViewHelpers\Widget\Controller;

/***
 *
 * This file is part of the "AJAX Pagination" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 *
 *  (c) 2019 Steffen Keuper <steffen.keuper@d-mind.de>, d-mind GmbH
 *
 ***/

use TYPO3\CMS\Fluid\ViewHelpers\Widget\Controller\PaginateController;

/**
 * Class AjaxPaginateController
 * @package SKeuper\AjaxPagination\ViewHelpers\Widget\Controller
 */
class AjaxPaginateController extends PaginateController
{

    /**
     * extend default configuration by custom keys in constructor
     *
     * AjaxPaginateController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->configuration['updateBrowserHistory'] = false;
    }

    /**
     * call the default initialize action
     */
    public function initializeAction()
    {
        parent::initializeAction();
    }

    /**
     * @param int $currentPage
     */
    public function indexAction($currentPage = 1)
    {
        parent::indexAction($currentPage);
    }

}