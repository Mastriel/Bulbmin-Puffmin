import './app.css'
import App from './App.svelte'

import "./input"
import {mount} from "svelte";

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
