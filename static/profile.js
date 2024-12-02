let owner = "aayush2";
fetch(`/api/code/${owner}`)
    .then((data) => {
        data.json()
        .then((j_data) => {
            create_code_elems(j_data.codes);
            document.getElementById('loading').innerText = "YOUR CODES"
        })
    });

function create_code_elems(codes) {
    const your_codes = document.getElementById('your_codes');
    codes.forEach(element => {
        let padded_val = element.value.toString().padStart(6, '0');
        let code_div = document.createElement('div');
        let note = document.createElement('span');
        let del = document.createElement('a');

        del.innerText = "DELETE";
        del.className = "ml-4";
        del.addEventListener('click',async()=>{
            try {
                // console.log({value:element.value,owner:owner,password:"test"})
                const response = await fetch("/api/code/delete",{
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json", // Specify the content type
                    },
                    body:JSON.stringify({value:element.value,owner:owner,password:"test"})
                });
                const json = await response.json();
                if(json.success){
                    code_div.remove();
                }
            } catch (error) {
                console.error(error.message);
            }
        })

        note.innerText = padded_val + "=>" + element.note ;

        code_div.className = "mt-1 flex justify-between";

        code_div.appendChild(note);
        code_div.appendChild(del);
        your_codes.appendChild(code_div);
    });
}