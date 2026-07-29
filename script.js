const URL_API = "https://script.google.com/macros/s/AKfycbz3Z_79FI4l4HTnvKIhWzqXcDwIfWSCSqkDj1nlJNbRXC4WZME5xDjKTvUdwT4Ube4Vlw/exec";


const nomeInput = document.getElementById("nome");

const inputCamera = document.getElementById("input-camera");

const inputGaleria = document.getElementById("input-galeria");

const preview = document.getElementById("preview");

const previewContainer = document.getElementById("preview-container");

const btnAlbum = document.getElementById("btnAlbum");



inputCamera.addEventListener("change", function(){

    if(this.files.length){

        enviarFoto(this.files[0]);

    }

});



inputGaleria.addEventListener("change", function(){

    if(this.files.length){

        enviarFoto(this.files[0]);

    }

});



btnAlbum.addEventListener("click", abrirAlbum);




function enviarFoto(arquivo){


    if(!arquivo.type.startsWith("image/")){


        Swal.fire({

            icon:"error",

            title:"Arquivo inválido",

            text:"Escolha uma imagem."

        });


        return;

    }



    mostrarPreview(arquivo);



    Swal.fire({

        title:"Preparando foto...",

        text:"Aguarde enquanto revelamos sua foto.",

        allowOutsideClick:false,

        didOpen:function(){

            Swal.showLoading();

        }

    });



    reduzirImagem(arquivo)

    .then(function(base64){


        enviarParaDrive(base64, arquivo.name);


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


    preview.src = URL.createObjectURL(arquivo);

    previewContainer.style.display="block";


}







function reduzirImagem(arquivo){


    return new Promise(function(resolve,reject){



        var leitor = new FileReader();



        leitor.onload=function(e){



            var imagem = new Image();



            imagem.onload=function(){



                var largura = imagem.width;

                var altura = imagem.height;



                var limite = 1200;



                if(largura > altura){


                    if(largura > limite){


                        altura = altura * limite / largura;

                        largura = limite;


                    }


                }

                else{


                    if(altura > limite){


                        largura = largura * limite / altura;

                        altura = limite;


                    }


                }




                var canvas=document.createElement("canvas");


                canvas.width=largura;

                canvas.height=altura;




                var contexto=canvas.getContext("2d");



                contexto.drawImage(

                    imagem,

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



            imagem.onerror=reject;


            imagem.src=e.target.result;



        };



        leitor.onerror=reject;


        leitor.readAsDataURL(arquivo);



    });


}







function enviarParaDrive(base64,nomeArquivo){



    var dados = new FormData();



    dados.append(

        "acao",

        "salvarFoto"

    );



    dados.append(

        "base64Data",

        base64

    );



    dados.append(

        "fileName",

        nomeArquivo

    );



    dados.append(

        "nomeConvidado",

        nomeInput.value.trim()

    );






    fetch(URL_API,{


        method:"POST",


        body:dados


    })


    .then(function(resposta){


        return resposta.json();


    })


    .then(function(resultado){



        Swal.close();



        if(resultado.sucesso){



            Swal.fire({


                icon:"success",


                title:"Foto revelada! 👑",


                text:"Sua foto já está no álbum.",


                showCancelButton:true,


                confirmButtonText:"Tirar outra",


                cancelButtonText:"Ver álbum"


            })


            .then(function(opcao){



                limparTela();



                if(opcao.dismiss === Swal.DismissReason.cancel){


                    abrirAlbum();


                }


            });



        }

        else{


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


            title:"Falha no envio",


            text:"Não foi possível conectar ao álbum."


        });



    });



}








function abrirAlbum(){



    var dados = new FormData();


    dados.append(

        "acao",

        "obterLink"

    );




    fetch(URL_API,{


        method:"POST",


        body:dados


    })


    .then(function(resposta){


        return resposta.json();


    })


    .then(function(resultado){



        if(resultado.sucesso){


            window.open(

                resultado.url,

                "_blank"

            );


        }

        else{


            Swal.fire({


                icon:"error",


                title:"Erro",


                text:resultado.msg


            });


        }



    })

    .catch(function(){



        Swal.fire({


            icon:"error",

            title:"Erro",

            text:"Não foi possível abrir o álbum."


        });



    });



}








function limparTela(){


    inputCamera.value="";


    inputGaleria.value="";


    preview.src="";


    previewContainer.style.display="none";


}