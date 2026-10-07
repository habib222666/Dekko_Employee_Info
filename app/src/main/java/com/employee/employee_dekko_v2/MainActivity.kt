package com.employee.employee_dekko_v2

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            javaScriptCanOpenWindowsAutomatically = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        WebView.setWebContentsDebuggingEnabled(true)

        val liveUrl = String(
            byteArrayOf(104,116,116,112,115,58,47,47,104,97,98,105,98,50,50,50,54,54,54,46,103,105,116,104,117,98,46,105,111,47,68,101,107,107,111,95,69,109,112,108,111,121,101,101,95,73,110,102,111,47)
        )
        webView.loadUrl(liveUrl)

        setContentView(webView)
    }
}
