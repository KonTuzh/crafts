/* eslint-disable */
import Trigger from './classes/Trigger';

const createTriggerInstance = () => {
  return new Trigger(document.body);
};

export const jsTriggerInit = () => {
  document.addEventListener("DOMContentLoaded", createTriggerInstance);
};