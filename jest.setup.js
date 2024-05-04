// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

var localStorageMock = (function() {
  let store = {};

  return {
    getItem: function(key) {
      return store[key];
    },

    setItem: function(key, value) {
      store[key] = value.toString();
    },

    clear: function() {
      store = {};
    },

    removeItem: function(key) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
