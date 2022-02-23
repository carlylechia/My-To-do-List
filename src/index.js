import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['I', 'finally', 'got', 'it!'], ' ');
  element.classList.add('title');

  return element;
}

document.body.appendChild(component());