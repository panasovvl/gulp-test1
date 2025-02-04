"use strict";

const _$ = (q, elm) => (elm ? elm : document).querySelector(q);
const _$$ = (q, elm) => (elm ? elm : document).querySelectorAll(q);

class MyClass {
    hi () {
        
    }
}

_$('button').addEventListener('click', evt => {
    console.log('click4');
})