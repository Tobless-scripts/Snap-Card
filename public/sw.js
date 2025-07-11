if (!self.define) {
    let e,
        n = {};
    const s = (s, a) => (
        (s = new URL(s + ".js", a).href),
        n[s] ||
            new Promise((n) => {
                if ("document" in self) {
                    const e = document.createElement("script");
                    (e.src = s), (e.onload = n), document.head.appendChild(e);
                } else (e = s), importScripts(s), n();
            }).then(() => {
                let e = n[s];
                if (!e)
                    throw new Error(`Module ${s} didn’t register its module`);
                return e;
            })
    );
    self.define = (a, i) => {
        const t =
            e ||
            ("document" in self ? document.currentScript.src : "") ||
            location.href;
        if (n[t]) return;
        let r = {};
        const c = (e) => s(e, t),
            f = { module: { uri: t }, exports: r, require: c };
        n[t] = Promise.all(a.map((e) => f[e] || c(e))).then(
            (e) => (i(...e), r)
        );
    };
}
define(["./workbox-00a24876"], function (e) {
    "use strict";
    importScripts(),
        self.skipWaiting(),
        e.clientsClaim(),
        e.precacheAndRoute(
            [
                {
                    url: "/_next/app-build-manifest.json",
                    revision: "19465f367f63f5dbc36cc09cf6d7c362",
                },
                {
                    url: "/_next/build-manifest.json",
                    revision: "f17d73dbfe9e29819b7425cd4ab18bbf",
                },
                {
                    url: "/_next/react-loadable-manifest.json",
                    revision: "383f6fdafee5a6f783794a1d82a729ed",
                },
                {
                    url: "/_next/server/app/(auth)/forgot-password/page_client-reference-manifest.js",
                    revision: "17a0f10fdc82fee515bb77094335c580",
                },
                {
                    url: "/_next/server/app/(auth)/login/page_client-reference-manifest.js",
                    revision: "c27e2873093f83cedaad07195aec837b",
                },
                {
                    url: "/_next/server/app/(auth)/register/page_client-reference-manifest.js",
                    revision: "1f4da774f675125657635149df8e64e2",
                },
                {
                    url: "/_next/server/app/_not-found/page_client-reference-manifest.js",
                    revision: "0c7418962962ee4664d08a43c5f1fa27",
                },
                {
                    url: "/_next/server/app/dashboard/page_client-reference-manifest.js",
                    revision: "1d4101e7011bc210cc5357628e9ec04a",
                },
                {
                    url: "/_next/server/app/offline/page_client-reference-manifest.js",
                    revision: "71104121b37595bba065bbb6f60ff5d1",
                },
                {
                    url: "/_next/server/app/page_client-reference-manifest.js",
                    revision: "73d151269fe953a4bed5e3288d9a5b7f",
                },
                {
                    url: "/_next/server/app/profile/page_client-reference-manifest.js",
                    revision: "313449764bdc0ac7192b02bd93dc84b3",
                },
                {
                    url: "/_next/server/app/qrcode/page_client-reference-manifest.js",
                    revision: "fe2d3b5c4b951252134e6b2486d156f7",
                },
                {
                    url: "/_next/server/app/saved/page_client-reference-manifest.js",
                    revision: "7ca4e11025e4bd0ae2c53502d3bd70ce",
                },
                {
                    url: "/_next/server/app/scan/page_client-reference-manifest.js",
                    revision: "8ee81bae497b54d0c7d4ac84c03598eb",
                },
                {
                    url: "/_next/server/middleware-build-manifest.js",
                    revision: "9c3bf38f9d0022ffe312654c1c94586f",
                },
                {
                    url: "/_next/server/middleware-react-loadable-manifest.js",
                    revision: "721fef60252c944b75b9c7368b4f5553",
                },
                {
                    url: "/_next/server/next-font-manifest.js",
                    revision: "9fce7989bff5d35b01e177447faca50d",
                },
                {
                    url: "/_next/server/next-font-manifest.json",
                    revision: "d51420cd4aa5d37d6719849cf36d0d6f",
                },
                {
                    url: "/_next/static/chunks/297-3f72723ca0d828c0.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/341.df3329d77a5faa19.js",
                    revision: "df3329d77a5faa19",
                },
                {
                    url: "/_next/static/chunks/392-5a8540b72709fa5e.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/472.a3826d29d6854395.js",
                    revision: "a3826d29d6854395",
                },
                {
                    url: "/_next/static/chunks/4bd1b696-5c01a1ab75fb09e9.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/684-3f242f75925b517d.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/707-ac92e0fb09a18c0c.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/766-74651bf1838bc89e.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/7cb1fa1f-1822bc2611099e2d.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/862-5d2f9ad4c78ed07f.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/874-24de34c0e1485afe.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/ae6eea6a-c870a51db8dc1bc5.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/(auth)/forgot-password/page-9358353e1bc2177e.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/(auth)/login/page-e35868af71166c85.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/(auth)/register/page-5f8afc3082f68d72.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/_not-found/page-b72775331b0d468e.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/dashboard/page-de7657f68a3d420d.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/layout-0dca77edae80efb2.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/not-found-f2d6be033cdb3233.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/offline/page-e64fd3f1fac1582d.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/page-e31ba10a40531c2a.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/profile/page-b8555fcaccfd6787.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/qrcode/page-a9699a900553301f.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/saved/page-4caf9e4ced1f3999.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/app/scan/page-74f5d24717316b94.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/bc9e92e6-12f45cf5aa5b5a46.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/framework-f593a28cde54158e.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/main-48f23f4278946399.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/main-app-970f547742dd0ce5.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/pages/_app-568e058c4a5ce49c.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/pages/_error-fd8f0f66b4509965.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
                    revision: "846118c33b2c0e922d7b3a7676f81f6f",
                },
                {
                    url: "/_next/static/chunks/webpack-af78f5c2c11af041.js",
                    revision: "VEXDqnm55vNBCKWaS3AOd",
                },
                {
                    url: "/_next/static/css/1173af33d14aa0ea.css",
                    revision: "1173af33d14aa0ea",
                },
                { url: "/offline", revision: null },
            ],
            { ignoreURLParametersMatching: [] }
        ),
        e.cleanupOutdatedCaches(),
        e.registerRoute(
            "/",
            new e.NetworkFirst({
                cacheName: "start-url",
                plugins: [
                    {
                        cacheWillUpdate: async ({
                            request: e,
                            response: n,
                            event: s,
                            state: a,
                        }) =>
                            n && "opaqueredirect" === n.type
                                ? new Response(n.body, {
                                      status: 200,
                                      statusText: "OK",
                                      headers: n.headers,
                                  })
                                : n,
                    },
                ],
            }),
            "GET"
        ),
        e.registerRoute(
            /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            new e.CacheFirst({
                cacheName: "google-fonts",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 10,
                        maxAgeSeconds: 31536e3,
                    }),
                ],
            }),
            "GET"
        ),
        e.registerRoute(
            /^\/_next\/static\/.*/i,
            new e.CacheFirst({
                cacheName: "static-resources",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 100,
                        maxAgeSeconds: 2592e3,
                    }),
                ],
            }),
            "GET"
        ),
        e.registerRoute(
            /^\/$/i,
            new e.NetworkFirst({
                cacheName: "start-url",
                plugins: [
                    new e.ExpirationPlugin({
                        maxEntries: 1,
                        maxAgeSeconds: 86400,
                    }),
                ],
            }),
            "GET"
        ),
        e.registerRoute(
            /^\/offline$/i,
            new e.StaleWhileRevalidate({
                cacheName: "offline-page",
                plugins: [],
            }),
            "GET"
        );
});
