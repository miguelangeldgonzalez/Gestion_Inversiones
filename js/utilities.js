import {s, get} from "./app.js";

export function createModal(modalDiv, openModal, windowClick = true){
    let close = s(modalDiv + " .close");
    let open = s(openModal);
    let modal = s(modalDiv);
    let modalC = modal.parentNode;
    
    open.addEventListener("click", e => {
        e.preventDefault();
    
        modalC.style.opacity = "1";
        modalC.style.visibility = "visible";
    
        modal.classList.toggle("modal-close");
    
    });
    close.addEventListener("click", e => {
        modal.classList.toggle("modal-close");
        setTimeout(() => {
            modalC.style.opacity = "0";
            modalC.style.visibility = "hidden";
        }, 500)
    });

    if(windowClick){
        window.addEventListener("click", e => {
            if (e.target == modalC) {
                modal.classList.toggle("modal-close");
                setTimeout(() => {
                    modalC.style.opacity = "0";
                    modalC.style.visibility = "hidden";
                }, 500)
            }
        });
    }
}

export function confirmPassword(password, passwordConfirmButton){
    let count = 0;

    let p = 0;
    if(password.value.length >= 5){
		p++;
		for(let l of password.value){
			let nums = /^[0-9]+$/;
			if(l.match(nums)){
				p++;
				break;
			}
		}
		for(let l of password.value){
			let letters = /^[A-Z]+$/i;
			
			if(l.match(letters)){
				p++;
				break;
			}
		}
	}
	
	if(p > 2){
		password.className = "form-control is-valid";
		count++;
	}else{
		password.className = "form-control is-invalid";
		count--;
	}
	
	if(passwordConfirmButton.value == password.value && password.value != ""){
		count++;
		passwordConfirmButton.className = "form-control is-valid";
	}else{
		count--;
		passwordConfirmButton.className = "form-control is-invalid";
	}

    if(count == 2){
        return true;
    }else{
        return false;
    }
}

//Load user
//callBack - Do something after the query
//Redirect - True if want to redirect to index when there is no loaded users, false otherwise
export function getUser(callBack, redirect = true){
    //Add event to close the session
    if(s("#close").length != 0){
        s("#close").addEventListener("click", () => {
            get("php/close.php", r => {
                window.location = "index.html";
            });
        });
    }

    get("php/user.php", data => {
        data.range = 0;

        if(data == ""){
            if(redirect){
                window.location = "index.html";
            }
        }else{
            s("#title").innerHTML = data.nombres;
 
            switch(data.cargo){
                case "Control":
                case "Gerente":
                    data.range = 3;
                    break;
                case "Administracion":
                    data.range = 2;
                    break;
                case "Asesor":
                    data.range = 1;
                    break;
                default:
                    window.location = "index.html";
            }

            //Add employee panel for users with
            //Control, managment and adminsitration permission
            let url = window.location.pathname.split("/");
            url = url[url.length - 1];
            
            if(data.range > 1 && !!s("#nav") && (url != "employees.html" && url != "sells.html")){
                s("#nav").innerHTML += `<li class='nav-item'><a class='nav-link' href='./employees.html'>Empleados</a></li><li class='nav-item'><a class='nav-link' href='./sales.html'>Ventas</a><ul class="navbar-nav submenu">
                <li class="nav-item" aria-current="true"><a class="nav-link" href="sales-report.html">Reporte de Ventas</a></li>
                </ul></li>`;
            }
        }
        callBack(data);
    }, true);
}