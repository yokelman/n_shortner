fetch('/api/code', { method: "POST", headers: { "Content-Type": "application/json" } })
    .then((data) => {
        data.json()
            .then((j_data) => {
                create_code_elems(j_data.codes);
            })
    })

function create_code_elems(codes) {
    const codes_container = document.getElementById('codes_container');
    codes.forEach(element => {
        let padded_val = element._id.toString().padStart(6, '0');

        let code_div = document.createElement('div');

        code_div.className = "w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-h-[25vh] bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500 transition-colors flex flex-col overflow-hidden p-4 shadow-lg";

        let note = document.createElement('h3');
        note.innerText = element.note;
        note.className = "text-xl text-gray-200 font-bold mb-2 truncate";
        code_div.appendChild(note);

        if (element.preview) {
            let img = document.createElement('img');
            img.src = `data:image/png;base64,${element.preview}`;
            img.className = "w-full h-40 object-cover mb-4 rounded border border-gray-700 shadow-inner";
            code_div.appendChild(img);
        } else {
            let spacer = document.createElement('div');
            spacer.className = "flex-grow";
            code_div.appendChild(spacer);
        }

        let button_container = document.createElement('div');
        button_container.className = "mt-auto pt-4 border-t border-gray-700 flex justify-between items-center";

        let code_text = document.createElement('span');
        code_text.innerText = `Code: ${padded_val}`;
        code_text.className = "text-gray-400 font-mono text-sm";

        let visit_btn = document.createElement('a');
        visit_btn.innerText = "Visit Site";
        visit_btn.href = padded_val;
        visit_btn.target = "_blank";
        visit_btn.className = "bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded text-sm transition-colors";

        button_container.appendChild(code_text);
        button_container.appendChild(visit_btn);

        code_div.appendChild(button_container);
        codes_container.appendChild(code_div);
    });
}