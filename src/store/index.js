import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      scale: 16,
    };
  },
  mutations: {
    setScale(state, value) {
      state.scale = value;
    },
  },
  actions: {},
  modules: {},
});
