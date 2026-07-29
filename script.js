const URL_API = "https://script.google.com/macros/s/AKfycbz3Z_79FI4l4HTnvKIhWzqXcDwIfWSCSqkDj1nlJNbRXC4WZME5xDjKTvUdwT4Ube4Vlw/exec";


// ==========================
// ELEMENTOS
// ==========================

const welcomeScreen = document.getElementById("welcome-screen");
const cameraScreen = document.getElementById("camera-screen");

const entrarBtn = document.getElementById("entrar-btn");

const nomeInput = document.getElementById("nome");

const inputCamera = document.getElementById("input-camera");
const inputGaleria = document.getElementById("input-galeria");

const previewContainer = document.getElementById("preview-container");
const preview = document.getElementById("preview");

const btnEnviarFoto = document.getElementById("btnEnviarFoto");
const btnDescartarFoto = document.getElementById("btnDescartarFoto");

const btnAlbum = document.getElementById("btnAlbum");


// Guarda a foto escolhida antes do envio
let arquivoSelecionado = null;



// ==========================
// ENTRAR NA FESTA
// ==========================

entrarBtn.addEventListener("click", function(){

    welcomeScreen.style.display = "none";

    cameraScreen.style.display = "block";

});




// ==========================
// ESCOLHER FOTO
// ==========================

inputCamera.addEventListener("change", function(){

    if(this.files.length){

        selecionarFoto(this.files[0]);

    }

});



inputGaleria.addEventListener("change", function(){

    if(this.files.length){

        selecionarFoto(this.files[0]);

    }

});






// ==========================
// MOSTRA PREVIEW
// ==========================

function selecionarFoto(arquivo){


    if(!arquivo.type.startsWith("image/")){


        Swal.fire({

            icon:"error",

            title:"Arquivo inválido",

            text:"Escolha apenas imagens."

        });


        return;

    }



    arquivoSelecionado = arquivo;



    const leitor = new FileReader();



    leitor.onload = function(e){


        preview.src = e.target.result;


        previewContainer.style.display = "block";


        previewContainer.scrollIntoView({

            behavior:"smooth"

        });


    };



    leitor.readAsDataURL(arquivo);


}








// ==========================
// DESCARTAR FOTO
// ==========================

btnDescartarFoto.addEventListener("click",function(){


    limparPreview();


});




function limparPreview(){


    arquivoSelecionado = null;


    inputCamera.value = "";

    inputGaleria.value = "";


    preview.src = "";


    previewContainer.style.display = "none";


}








// ==========================
// ENVIAR FOTO CONFIRMADA
// ==========================

btnEnviarFoto.addEventListener("click",function(){


    if(!arquivoSelecionado){


        Swal.fire({

            icon:"warning",

            title:"Nenhuma foto selecionada",

            text:"Escolha uma foto antes de enviar."

        });


        return;

    }




    Swal.fire({

        title:"Enviando sua foto...",

        text:"Guardando este momento especial.",

        allowOutsideClick:false,


        didOpen:function(){

            Swal.showLoading();

        }

    });





    comprimirImagem(arquivoSelecionado)

    .then(function(base64){


        enviarFoto(

            base64,

            arquivoSelecionado.name

        );


    })

    .catch(function(){


        Swal.close();


        Swal.fire({

            icon:"error",

            title:"Erro",

            text:"Não foi possível preparar a imagem."

        });


    });



});









// ==========================
// COMPACTAR IMAGEM
// ==========================

function comprimirImagem(arquivo){


return new Promise(function(resolve,reject){


    const leitor = new FileReader();



    leitor.onload=function(e){



        const img = new Image();



        img.onload=function(){



            let largura = img.width;

            let altura = img.height;


            const limite = 1200;



            if(largura > altura){


                if(largura > limite){

                    altura = altura * limite / largura;

                    largura = limite;

                }


            }else{


                if(altura > limite){

                    largura = largura * limite / altura;

                    altura = limite;

                }


            }



            const canvas = document.createElement("canvas");



            canvas.width = largura;

            canvas.height = altura;



            const ctx = canvas.getContext("2d");



            ctx.drawImage(

                img,

                0,

                0,

                largura,

                altura

            );



            resolve(

                canvas.toDataURL(

                    "image/jpeg",

                    0.75

                )

            );



        };



        img.onerror = reject;



        img.src = e.target.result;


    };



    leitor.onerror = reject;



    leitor.readAsDataURL(arquivo);



});


}









// ==========================
// ENVIO PARA APPS SCRIPT
// ==========================

function enviarFoto(base64,nomeArquivo){



const dados = {


    acao:"salvarFoto",


    base64Data:base64,


    fileName:nomeArquivo,


    nomeConvidado:nomeInput.value.trim()


};





fetch(URL_API,{


    method:"POST",


    headers:{


        "Content-Type":"text/plain;charset=utf-8"


    },


    body:JSON.stringify(dados)


})



.then(function(res){

    return res.json();

})



.then(function(resultado){



    Swal.close();




    if(resultado.sucesso){



        Swal.fire({


            icon:"success",


            title:"Foto enviada! 👑",


            text:"Obrigado por participar desta lembrança.",


            showDenyButton:true,


            showCancelButton:true,


            confirmButtonText:"Tirar outra foto",


            denyButtonText:"Não, já terminei",


            cancelButtonText:"Ver álbum",


            confirmButtonColor:"#c5a059",


            denyButtonColor:"#555",


            cancelButtonColor:"#222"


        })

        .then(function(resposta){



            if(resposta.isConfirmed){


                limparTudo(false);


            }


            else if(resposta.isDenied){


                limparTudo(true);


                voltarInicio();


            }


            else if(resposta.dismiss === Swal.DismissReason.cancel){


                limparTudo(true);


                abrirAlbum();


            }



        });



    }else{


        Swal.fire({

            icon:"error",

            title:"Erro",

            text:resultado.msg || "Falha no envio."

        });


    }



})



.catch(function(){



    Swal.close();



    Swal.fire({

        icon:"error",

        title:"Erro de comunicação",

        text:"Não foi possível enviar a foto."

    });



});



}









// ==========================
// ÁLBUM
// ==========================

btnAlbum.addEventListener("click",abrirAlbum);



function abrirAlbum(){



fetch(URL_API,{


    method:"POST",


    headers:{


        "Content-Type":"text/plain;charset=utf-8"


    },


    body:JSON.stringify({

        acao:"obterLink"

    })


})


.then(function(res){

    return res.json();

})


.then(function(resultado){



    if(resultado.sucesso){


        window.open(resultado.url,"_blank");


    }


    else{


        Swal.fire({

            icon:"error",

            title:"Erro",

            text:"Não foi possível abrir o álbum."

        });


    }



});



}









// ==========================
// LIMPEZA
// ==========================

function limparTudo(limparNome){


    limparPreview();



    if(limparNome){


        nomeInput.value = "";


    }



}






function voltarInicio(){


    cameraScreen.style.display="none";


    welcomeScreen.style.display="block";


}