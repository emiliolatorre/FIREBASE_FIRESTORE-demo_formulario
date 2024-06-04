const firebaseConfig = {
    apiKey: "AIzaSyAuLH-B5suV6RhxfnuTiEGwZkXW4aGSVz8",
    authDomain: "fir-demo-e0698.firebaseapp.com",
    projectId: "fir-demo-e0698",
    storageBucket: "fir-demo-e0698.appspot.com",
    messagingSenderId: "596752096583",
    appId: "1:596752096583:web:46008be2c6fcbef2508062"
  }

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

//captura myForm
const myForm = document.getElementById("myForm")

//Función auxiliar para pintar una foto en el album
const printPhoto = (nombre, email, mensaje, urlImg, docId) => {

  let card = document.createElement('article');
  card.setAttribute('class', 'card');
  
  let pName = document.createElement('p');
  pName.innerHTML = nombre;

  let pEmail = document.createElement('p');
  pEmail.innerHTML = email;

  let pMensaje = document.createElement('p');
  pMensaje.innerHTML = mensaje;

  let picture = document.createElement('img');
  picture.setAttribute('src', urlImg);
  picture.setAttribute('style', 'max-width:100px');

  let id = document.createElement('p');
  id.innerHTML = docId;

  const usuarios = document.getElementById('usuarios');
  card.append(pName, pEmail, pMensaje, picture, id);
  usuarios.appendChild(card);
};

//Create
const createUsuario = (usuario) => {
  db.collection("formulario")
    .add(usuario)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      readAll();
    })
    .catch((error) => console.error("Error adding document: ", error));
};

//Read all
const readAll = () => {
  // Limpia el album para mostrar el resultado
  cleanUsuarios();

  //Petición a Firestore para leer todos los documentos de la colección album
  db.collection("formulario")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        printPhoto(doc.data().nombre, doc.data().email, doc.data().mensaje, doc.data().urlImg, doc.id)
      });

    })
    .catch(() => console.log('Error reading documents'));;
};

//Delete
const deletePicture = () => {
  const id = prompt('Introduce el ID a borrar');
  db.collection('formulario').doc(id).delete().then(() => {
    alert(`Documento ${id} ha sido borrado`);
    //Clean
    document.getElementById('usuarios').innerHTML = "";
    //Read all again
    readAll();
  })
    .catch(() => console.log('Error borrando documento'));
};

//Clean 
const cleanUsuarios = () => {
  document.getElementById('usuarios').innerHTML = "";
};

//Show on page load
/* readAll(); */

//**********EVENTS**********

//Create
myForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = myForm.nombre.value;
  const email = myForm.email.value;
  const mensaje = myForm.mensaje.value;
  const urlImg = myForm.urlImg.value;
  console.log(nombre, email, mensaje, urlImg)
  if (!nombre || !email || !mensaje || !urlImg) {
    alert("Hay un campo vacio. No se ha salvado");
    return
  }
  createUsuario({
    nombre,
    email,
    mensaje,
    urlImg,
  });
});

//Read all
document.getElementById("read-all").addEventListener("click", () => {
  readAll();
});

//Read one
document.getElementById('read-one').addEventListener("click", () => {
  const id = prompt("Introduce el id a buscar");
  readOne(id);
});

//Delete one
document.getElementById('delete').addEventListener('click', () => {
  deletePicture();
});

//Clean
document.getElementById('clean').addEventListener('click', () => {
  cleanUsuarios();
});

/* const readAllUsers = (born) => {
  db.collection("users")
    .where("first", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
}; */

// Read ONE
function readOne(id) {
  // Limpia el album para mostrar el resultado
  cleanUsuarios();

  //Petición a Firestore para leer un documento de la colección album 
  var docRef = db.collection("formulario").doc(id);

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      printPhoto(doc.data().nombre, doc.data().email, doc.data().mensaje, doc.data().urlImg, doc.id)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}

/**************Firebase Auth*****************/

/*

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Saves user in firestore
      createUser({
        id: user.uid,
        email: user.email,
        message: "hola!"
      });

    })
    .catch((error) => {
      console.log("Error en el sistema" + error.message, "Error: " + error.code);
    });
};


document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;

  pass === pass2 ? signUpUser(email, pass) : alert("error password");
})


const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

const signOut = () => {
  let user = firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("Sale del sistema: " + user.email)
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
}


document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass)
})
document.getElementById("salir").addEventListener("click", signOut);

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
    document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;
  } else {
    console.log("no hay usuarios en el sistema");
    document.getElementById("message").innerText = `No hay usuarios en el sistema`;
  }
});

*/

