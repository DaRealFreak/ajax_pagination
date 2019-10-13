<?php /** @noinspection DuplicatedCode */

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

use TYPO3\CMS\Extbase\Mvc\Controller\ControllerContext;

/**
 * Class LinkViewHelper
 * @package SKeuper\AjaxPagination\ViewHelpers\Widget
 */
class LinkViewHelper extends \TYPO3\CMS\Fluid\ViewHelpers\Widget\LinkViewHelper
{

    /**
     * Get the URI for a non-AJAX Request but with TypoScriptRendering arguments excluded
     * to retrieve the correct page link after loading content from the AJAX uri
     *
     * @return string the Widget URI
     */
    protected function getWidgetUri()
    {
        // compatibility to LinkViewHelper of TYPO3 8.x versions
        /** @var ControllerContext $controllerContext */
        $controllerContext = $this->controllerContext ?? $this->renderingContext->getControllerContext();

        /** @noinspection DuplicatedCode */
        $uriBuilder = $controllerContext->getUriBuilder();
        $argumentPrefix = $controllerContext->getRequest()->getArgumentPrefix();
        $arguments = $this->hasArgument('arguments') ? $this->arguments['arguments'] : [];
        if ($this->hasArgument('action')) {
            $arguments['action'] = $this->arguments['action'];
        }
        if ($this->hasArgument('format') && $this->arguments['format'] !== '') {
            $arguments['format'] = $this->arguments['format'];
        }
        return $uriBuilder->reset()
            ->setArguments([$argumentPrefix => $arguments])
            ->setSection($this->arguments['section'])
            ->setUseCacheHash($this->arguments['useCacheHash'])
            ->setAddQueryString(true)
            ->setAddQueryStringMethod($this->arguments['addQueryStringMethod'])
            ->setArgumentsToBeExcludedFromQueryString([$argumentPrefix, 'cHash', 'tx_typoscriptrendering[context]'])
            ->setFormat($this->arguments['format'])
            ->build();
    }

}