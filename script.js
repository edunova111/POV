const URL_API = "https://script.google.com/macros/s/AKfycbz3Z_79FI4l4HTnvKIhWzqXcDwIfWSCSqkDj1nlJNbRXC4WZME5xDjKTvUdwT4Ube4Vlw/exec";


// ELEMENTOS

const welcomeScreen = document.getElementById("welcome-screen");

const cameraScreen = document.getElementById("camera-screen");

const entrarBtn = document.getElementById("entrar-btn");


const nomeInput = document.getElementById("nome");

const inputCamera = document.getElementById("input-camera");

const inputGaleria = document.getElementById("input-galeria");

const preview = document.getElementById("preview");

const previewContainer = document.getElementById("preview-container");

const btnAlbum = document.getElementById("btnAlbum");





// ENTRAR NA FESTA

entrarBtn.addEventListener("click", function(){

    welcomeScreen.style.display = "none";

    cameraScreen.style.display = "block";

});







// ESCOLHA DA CÂMERA

inputCamera.addEventListener("change", function(){

    if(this.files.length){

        processarFoto(this.files[0]);

    }

});





// ESCOLHA DA GALERIA

inputGaleria.addEventListener("change", function(){

    if(this.files.length){

        processarFoto(this.files[0]);

    }

});





btnAlbum.addEventListener("click", abrirAlbum);









function processarFoto(arquivo){


    if(!arquivo.type.startsWith("image/")){


        Swal.fire({

            icon:"error",

            title:"Arquivo inválido",

            text:"Escolha somente imagens."

        });


        return;

    }



    mostrarPreview(arquivo);



    Swal.fire({

        title:"Enviando sua foto...",

        text:"Guardando este momento especial no álbum.",

        allowOutsideClick:false,


        didOpen:function(){

            Swal.showLoading();

        }

    });





    comprimirImagem(arquivo)

    .then(function(base64){


        enviarFoto(base64, arquivo.name);


    })

    .catch(function(){


        Swal.close();


        Swal.fire({

            icon:"error",

            title:"Erro",

            text:"Não foi possível preparar a imagem."

        });


    });



}









function mostrarPreview(arquivo){



    let leitor = new FileReader();



    leitor.onload=function(e){


        preview.src=e.target.result;


        previewContainer.style.display="block";


    };


    leitor.readAsDataURL(arquivo);


}









function comprimirImagem(arquivo){


return new Promise(function(resolve,reject){



    let leitor=new FileReader();



    leitor.onload=function(e){



        let img=new Image();



        img.onload=function(){



            let largura=img.width;

            let altura=img.height;


            let limite=1200;



            if(largura>altura){


                if(largura>limite){

                    altura*=limite/largura;

                    largura=limite;

                }


            }else{


                if(altura>limite){

                    largura*=limite/altura;

                    altura=limite;

                }


            }



            let canvas=document.createElement("canvas");


            canvas.width=largura;

            canvas.height=altura;



            canvas

            .getContext("2d")

            .drawImage(

                img,

                0,

                0,

                largura,

                altura

            );



            resolve(

                canvas.toDataURL(

                    "image/jpeg",

                    .75

                )

            );



        };



        img.onerror=reject;


        img.src=e.target.result;



    };



    leitor.onerror=reject;


    leitor.readAsDataURL(arquivo);



});

}









function enviarFoto(base64,nomeArquivo){



const dados={


    acao:"salvarFoto",


    base64Data:base64,


    fileName:nomeArquivo,


    nomeConvidado:nomeInput.value.trim()


};





fetch(URL_API,{


    method:"POST",


    body:JSON.stringify(dados)


})


.then(res=>res.json())


.then(resultado=>{


    Swal.close();



    if(resultado.sucesso){



        Swal.fire({


            icon:"success",


            title:"Foto enviada! 👑",


            text:"Obrigado por participar deste momento.",


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


                limparCampos(false);


            }


            else if(resposta.isDenied){



                limparCampos(true);


                voltarInicio();



            }


            else if(resposta.dismiss === Swal.DismissReason.cancel){



                limparCampos(true);


                abrirAlbum();


            }



        });




    }else{


        Swal.fire({

            icon:"error",

            title:"Erro",

            text:resultado.msg

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









function abrirAlbum(){


fetch(URL_API,{

    method:"POST",

    body:JSON.stringify({

        acao:"obterLink"

    })

})


.then(res=>res.json())


.then(resultado=>{


    if(resultado.sucesso){


        window.open(resultado.url,"_blank");


    }


});


}









function limparCampos(limparNome){



inputCamera.value="";


inputGaleria.value="";


preview.src="";


previewContainer.style.display="none";



if(limparNome){


    nomeInput.value="";


}



}









function voltarInicio(){


cameraScreen.style.display="none";


welcomeScreen.style.display="block";


}