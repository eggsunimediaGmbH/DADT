import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "Index" */ "../views/Index.vue"),
  },
  {
    path: "/GuideBridge",
    name: "GuideBridge",
    component: () =>
      import(
        /* webpackChunkName: "GuideBridge" */ "../views/GuideBridge/Index.vue"
      ),
    children: [
      {
        name: "GuideState",
        path: "GuideState",
        component: () =>
          import(
            /* webpackChunkName: "GuideState" */ "../views/GuideBridge/GuideState.vue"
          ),
      },
      {
        name: "Debugger",
        path: "Debugger",
        component: () =>
          import(
            /* webpackChunkName: "Debugger" */ "../views/GuideBridge/Debugger.vue"
          ),
      },
      {
        name: "Settings",
        path: "Settings",
        component: () =>
          import(
            /* webpackChunkName: "Debugger" */ "../views/GuideBridge/Settings.vue"
          ),
      },
    ],
  },
  {
    path: "/DataLayer",
    name: "Index",
    component: () =>
      import(
        /* webpackChunkName: "DataLayer" */ "../views/DataLayer/Index.vue"
      ),
    children: [
      {
        name: "DataLayerView",
        path: "DataLayerView",
        component: () =>
          import(
            /* webpackChunkName: "GuideState" */ "../views/DataLayer/DataLayer.vue"
          ),
      },
      {
        name: "DataLayerSettings",
        path: "DataLayerSettings",
        component: () =>
          import(
            /* webpackChunkName: "GuideState" */ "../views/DataLayer/Settings.vue"
          ),
      },
    ],
  },
  {
    path: "/Terminal",
    name: "Terminal",
    component: () =>
      import(/* webpackChunkName: "Terminal" */ "../views/Terminal.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
