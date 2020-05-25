export function create_radio_input(name, value, id) {
    // console.log("got here");
    const element = document.createElement("input");
    element.type = "radio";
    element.name = name;
    element.value = value;
    element.id = id;
    element.hidden = true;
    return element;
}

export function create_topping_choices(toppings) {
    const popup = document.getElementById("topping-popup");
    const popup_choices = document.getElementById("topping-choices");
    const popup_close = document.getElementById("topping-close");
    const fullscreen_container = document.getElementById("fullscreen-container");

    fullscreen_container.style.display = "block";
    fullscreen_container.style.opacity = "1";
    popup.style.visibility = "visible";
    while(popup_choices.firstChild) {
        popup_choices.removeChild(popup_choices.lastChild);
    }

    const close_popup = () => {
        popup.style.visibility = "hidden";
        fullscreen_container.style.display = "none";
        fullscreen_container.style.opacity = "100";
    }

    return new Promise((resolve, reject) => {
        // toppings.forEach(item => {
            
        toppings.map(item => {
            // console.log(item);
            const brk = document.createElement("BR");
            const name = item; // object.topping;
            const anchor = document.createElement("a");
            anchor.href = "#";
            anchor.id = name;
            anchor.innerHTML = name;
    
            popup_choices.append(anchor);
            popup_choices.append(brk);

            anchor.onclick = () => {
                close_popup();
                resolve(anchor.id);
            }
        });
        popup_close.onclick = () => {
            close_popup();
            reject("Clicked close");
        };
        fullscreen_container.onclick = () => {
        // window.onclick = () => {
            // console.log();
            close_popup();
            reject("Clicked outside popup");
        };
    });

}

export function create_num_input(value, min, max) {
    const num = document.createElement("input");
    num.type = "number";
    num.value = value;
    num.min = min;
    num.max = max;
    return num;
}

export function create_label(htmlfor, innnerhtml) {
    const label = document.createElement("label");
    label.className = "order-label";
    label.htmlFor = htmlfor;
    label.innerHTML = innnerhtml;
    return label;
}

export function sel_and_label_toggle(sel, label, value) {
    sel.disabled = value;
    label.hidden = value;
}

export function appendicitis(parent, ...children) {
    const brk = document.createElement("BR");
    children.map((child) => {
        parent.append(child)
        parent.append(brk);
    });
}