<?php

namespace SKeuper\AjaxPagination\ViewHelpers\Widget;

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

use SKeuper\AjaxPagination\ViewHelpers\Widget\Controller\AjaxPaginateController;
use TYPO3\CMS\Fluid\Core\Widget\AbstractWidgetViewHelper;

/**
 * Class AjaxPaginateViewHelper
 * @package SKeuper\AjaxPagination\ViewHelpers\Widget
 */
class PaginateViewHelper extends AbstractWidgetViewHelper
{

    /**
     * @var \SKeuper\AjaxPagination\ViewHelpers\Widget\Controller\AjaxPaginateController
     */
    protected $controller;

    /**
     * @param \SKeuper\AjaxPagination\ViewHelpers\Widget\Controller\AjaxPaginateController $controller
     */
    public function injectController(AjaxPaginateController $controller)
    {
        $this->controller = $controller;
    }

    /**
     * initialize additional arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('objects', 'mixed', 'Object', true);
        $this->registerArgument('as', 'string', 'as', true);
        $this->registerArgument('configuration', 'array', 'configuration', false, ['itemsPerPage' => 10, 'insertAbove' => false, 'insertBelow' => true, 'maximumNumberOfLinks' => 99]);
    }

    /**
     * Render everything
     *
     * @param \TYPO3\CMS\Extbase\Persistence\QueryResultInterface $objects
     * @param string $as
     * @param mixed $configuration
     * @param array $initial
     * @return string
     */
    public function render()
    {
        return $this->initiateSubRequest();
    }
}