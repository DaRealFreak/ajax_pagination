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
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

/**
 * Class ObjectUidViewHelper
 * @package SKeuper\AjaxPagination\ViewHelpers\Record\Resolve
 */
class ObjectUidViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    /**
     * ViewHelper to retrieve the uid of the currently rendering object
     *
     * @param array $arguments
     * @param \Closure $renderChildrenClosure
     * @param RenderingContextInterface $renderingContext
     * @return string The uid of the currently rendering object or an 'error' string
     */
    public static function renderStatic(array $arguments, \Closure $renderChildrenClosure, RenderingContextInterface $renderingContext)
    {
        /** @var ObjectManager $objectManager */
        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        /** @var ConfigurationManagerInterface $conf */
        $conf = $objectManager->get(ConfigurationManagerInterface::class);
        $cObj = $conf->getContentObject();

        if ($cObjUid = $cObj->data['uid']) {
            return $cObjUid;
        } else {
            return 0;
        }
    }
}