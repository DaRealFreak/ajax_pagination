<?php

namespace SKeuper\AjaxPagination\ViewHelpers\Record\Resolve;

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

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\CMS\Fluid\Core\Widget\WidgetRequest;

/**
 * Class PluginViewHelper
 * @package SKeuper\AjaxPagination\ViewHelpers\Record\Resolve
 */
class PluginViewHelper extends AbstractViewHelper
{

    /**
     * ViewHelper to retrieve the uid of the currently rendering object
     *
     * @return string The uid of the currently rendering object or an 'error' string
     */
    public function render()
    {
        $request = $this->controllerContext->getRequest();
        if ($request instanceof WidgetRequest) {
            $pluginName = $request->getWidgetContext()->getParentPluginName();
        } else {
            $pluginName = $request->getPluginName();
        }
        return $pluginName;
    }
}