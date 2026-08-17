package com.ykskocu.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "YksWidget")
public class YksWidgetPlugin extends Plugin {

    @PluginMethod
    public void refresh(
        PluginCall call
    ) {
        YksCountdownWidget.updateAll(
            getContext()
        );

        call.resolve();
    }
}