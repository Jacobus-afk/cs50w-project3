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
    label.htmlFor = htmlfor;
    label.innerHTML = innnerhtml;
    return label;
}

export function toggle_inputs(input_on, input_off) {

}