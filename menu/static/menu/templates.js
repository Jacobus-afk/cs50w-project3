export function create_radio_input(name, value, id) {
    // console.log("got here");
    const element = document.createElement("input");
    element.type = "radio";
    element.name = name;
    element.value = value;
    element.id = id;

    return element;
}

export function create_label(htmlfor, innnerhtml) {

}

export function toggle_inputs(input_on, input_off) {

}