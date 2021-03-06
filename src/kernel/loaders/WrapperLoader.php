<?php

require_once "interfaces/AbstractLoader.php";
// load all wrappers
foreach (new DirectoryIterator(WrapperLoader::WRAPPERS_DIR) as $fileInfo) {
    if ($fileInfo->isDot()) continue;
    if ($fileInfo->isDir() && strcmp($fileInfo->GetFilename(), "utils")) {
        require_once WrapperLoader::WRAPPERS_DIR . "/" . $fileInfo->getFilename() . "/wrapper.php";
    }
}

/**
 * @brief
 */
class WrapperLoader extends AbstractLoader
{

    // -- consts
    const WRAPPERS_DIR = "../wrappers";
    // -- static
    public static $_WRAPPERS = array();

    // -- functions

    public function __construct(&$kernel, &$manager)
    {
        // -- construct parent
        parent::__construct($kernel, $manager);
        // -- connect wrappers to kernel
        $this->__connect_wrappers_to_kernel($kernel);
    }

    /**
     *
     */
    public function Init()
    {
        parent::manager()->RegisterWrappers(WrapperLoader::$_WRAPPERS);
    }

    /**
     *
     */
    public static function RegisterWrapper($wrapper)
    {
        WrapperLoader::$_WRAPPERS[$wrapper->GetName()] = $wrapper;
    }

# PROTECTED & PRIVATE #####################################################

    private function __connect_wrappers_to_kernel($kernel)
    {
        foreach (WrapperLoader::$_WRAPPERS as $wrapper) {
            $wrapper->SetKernel($kernel);
        }
    }
}