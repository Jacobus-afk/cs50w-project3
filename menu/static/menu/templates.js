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

export function create_topping_choices(toppings, html_element) {
    while(html_element.firstChild) {
        html_element.removeChild(html_element.lastChild);
    }
    toppings.map(object => {
        const brk = document.createElement("BR");
        const name = object.topping;
        const anchor = document.createElement("a");
        anchor.href = "#";
        anchor.id = name;
        anchor.innerHTML = name;

        html_element.append(anchor);
        html_element.append(brk);
    })
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