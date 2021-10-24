import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export default createStore({
  plugins: [new VuexPersistence().plugin],
  state() {
    return {
      scale: 16,
      dataLayerExpression: "dataLayer",
      codeSnippets: [],
      selectedTheme: "arya-green",
    };
  },
  mutations: {
    setScale(state, value) {
      state.scale = value;
    },
    setDataLayerExpression(state, value) {
      state.dataLayerExpression = value;
    },
    setCodeSnippets(state, value) {
      state.codeSnippets = value;
    },
    setTheme(state, value) {
      state.selectedTheme = value;
    }
  },
  actions: {},
  modules: {},
});
