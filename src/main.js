import { h, render, hydrate } from 'preact';
import './design.css';
import './tv.css';
import './site.css';
import { App } from './App.js';

const root = document.getElementById('app');
// The build pre-renders the page into #app; hydrate it if it is there.
(root.firstElementChild ? hydrate : render)(h(App), root);
