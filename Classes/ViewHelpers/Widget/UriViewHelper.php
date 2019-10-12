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

/**
 * Class UriViewHelper
 * @package SKeuper\AjaxPagination\ViewHelpers\Widget
 */
class UriViewHelper extends \TYPO3\CMS\Fluid\ViewHelpers\Widget\UriViewHelper
{

    /**
     * Get the URI for a non-AJAX Request but with TypoScriptRendering arguments excluded
     * to retrieve the correct page URI after loading content from the AJAX uri
     *
     * @return string the Widget URI
     */
    protected function getWidgetUri()
    {
        /** @noinspection DuplicatedCode */
        $uriBuilder = $this->controllerContext->getUriBuilder();
        $argumentPrefix = $this->controllerContext->getRequest()->getArgumentPrefix();
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