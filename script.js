document.addEventListener('DOMContentLoaded', () => {
    const treeRoot = document.getElementById('tree-root');

    // Add this new function
    function addInitialNode() {
        if (treeRoot.children.length === 0) {
            const initialLi = document.createElement('li');
            const initialSpan = document.createElement('span');
            initialSpan.contentEditable = true;
            initialSpan.classList.add('node-content');
            initialSpan.textContent = 'New Node';
            initialLi.appendChild(initialSpan);
            treeRoot.appendChild(initialLi);
            initialSpan.focus();
        }
    }

    // Call addInitialNode when the page loads
    addInitialNode();

    treeRoot.addEventListener('keydown', handleKeyDown);

    function handleKeyDown(event) {
        if (event.target.classList.contains('node-content')) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (event.shiftKey) {
                    createNewNodeBefore(event.target);
                } else {
                    createNewNodeAfter(event.target);
                }
            } else if (event.key === 'Tab') {
                event.preventDefault();
                if (event.shiftKey) {
                    moveNodeBackward(event.target);
                } else {
                    moveNodeForward(event.target);
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                moveFocus(event.target, 'up');
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                moveFocus(event.target, 'down');
            }
        }
    }

    function createNewNodeAfter(currentNode) {
        const newLi = createNodeElement();
        const parentLi = currentNode.closest('li');
        const parentUl = parentLi.parentNode;

        parentUl.insertBefore(newLi, parentLi.nextSibling);
        newLi.querySelector('.node-content').focus();
    }

    function createNewNodeBefore(currentNode) {
        const newLi = createNodeElement();
        const parentLi = currentNode.closest('li');
        const parentUl = parentLi.parentNode;

        parentUl.insertBefore(newLi, parentLi);
        newLi.querySelector('.node-content').focus();
    }

    function createNodeElement() {
        const newLi = document.createElement('li');
        const newSpan = document.createElement('span');
        newSpan.contentEditable = true;
        newSpan.classList.add('node-content');
        newLi.appendChild(newSpan);
        return newLi;
    }

    function moveNodeForward(currentNode) {
        const currentLi = currentNode.closest('li');
        const prevLi = currentLi.previousElementSibling;

        if (prevLi) {
            let ul = prevLi.querySelector('ul');
            if (!ul) {
                ul = document.createElement('ul');
                prevLi.appendChild(ul);
            }
            ul.appendChild(currentLi);
            currentNode.focus();
        }
    }

    function moveNodeBackward(currentNode) {
        const currentLi = currentNode.closest('li');
        const parentUl = currentLi.parentNode;
        const parentLi = parentUl.closest('li');

        if (parentLi) {
            parentUl.parentNode.insertBefore(currentLi, parentLi.nextSibling);
            currentNode.focus();

            if (parentUl.children.length === 0) {
                parentUl.remove();
            }
        }
    }

    function moveFocus(currentNode, direction) {
        const currentLi = currentNode.closest('li');
        let targetNode;

        if (direction === 'up') {
            targetNode = getPreviousEditableNode(currentLi);
        } else {
            targetNode = getNextEditableNode(currentLi);
        }

        if (targetNode) {
            targetNode.focus();
        }
    }

    function getPreviousEditableNode(currentLi) {
        let prevLi = currentLi.previousElementSibling;
        if (prevLi) {
            return getLastDescendantOrSelf(prevLi).querySelector('.node-content');
        }
        return currentLi.parentElement.closest('li')?.querySelector('.node-content');
    }

    function getNextEditableNode(currentLi) {
        const firstChild = currentLi.querySelector('ul > li:first-child');
        if (firstChild) {
            return firstChild.querySelector('.node-content');
        }
        let nextLi = currentLi.nextElementSibling;
        while (!nextLi) {
            currentLi = currentLi.parentElement.closest('li');
            if (!currentLi) return null;
            nextLi = currentLi.nextElementSibling;
        }
        return nextLi.querySelector('.node-content');
    }

    function getLastDescendantOrSelf(li) {
        const lastChild = li.querySelector('ul:last-child > li:last-child');
        return lastChild ? getLastDescendantOrSelf(lastChild) : li;
    }

    // Add this event listener at the end of the DOMContentLoaded callback
    document.addEventListener('click', (event) => {
        if (event.target.closest('#tree-container') && treeRoot.children.length === 0) {
            addInitialNode();
        }
    });
});