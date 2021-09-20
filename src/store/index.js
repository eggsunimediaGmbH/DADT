import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      scale: 16,
      dataLayerExpression: "dataLayer",
    };
  },
  mutations: {
    setScale(state, value) {
      state.scale = value;
    },
    setDataLayerExpression(state, value) {
      state.dataLayerExpression = value;
    },
  },
  actions: {},
  modules: {},
});
