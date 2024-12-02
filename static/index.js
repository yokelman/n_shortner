fetch('/api/code',{method:"POST",headers: {"Content-Type": "application/json"}})
    .then((data) => {
        data.json()
        .then((j_data) => {
            create_code_elems(j_data.codes);
        })
    })

function create_code_elems(codes) {
    const codes_container = document.getElementById('codes_container');
    codes.forEach(element => {
        let padded_val = element.value.toString().padStart(6, '0');

        let code_div = document.createElement('div');
        let value = document.createElement('a');
        let note = document.createElement('span');

        note.innerText = element.note;
        value.innerText = `click to visit: ${padded_val}`;
        value.href = padded_val;

        code_div.className = "w-full lg:w-1/4 md:w-1/3 sm:w-1/2 min-h-[25vh] border border-black flex flex-col justify-between overflow-hidden p-2 my-1";

        code_div.appendChild(note);
        code_div.appendChild(value);
        codes_container.appendChild(code_div);
    });
}