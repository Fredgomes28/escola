import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencil, FaTrashCan } from 'react-icons/fa6';
export default function CrudUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [turma, setTurma] = useState("");
    const [idade, setIdade] = useState("");
    const [operacao, setOperacao] = useState("");
}
const url = "http://localhost:8081/usuarios/";
useEffect(() => {
    fetch(url)
        .then((respFetch) => respFetch.json())
        .then((respJson) => setUsuarios(respJson))
        .catch((err) => console.log(err));
}, [url]);

function novosDados() {
    setOperacao("criarRegistro");

}
function limparDados() {
    setId("");
    setNome("");
    setEmail("");
    setTurma("");
    setIdade("");
    setOperacao("");
}

function editarDados(cod) {
    let usuario = usuarios.find((item) => item.id === cod);
    const { id, nome, email, turma, idade } = usuario;
    setOperacao("editarRegistro");
    setId(id);
    setNome(nome);
    setEmail(email);
    setTurma(turma);
    setIdade(idade);
}
function apagarDados(cod) {
    axios.delete(url + cod)
        .then(() => setUsuarios(usuarios.filter(item =>
            item.id !== cod)))
        .catch((erro) => console.log(erro));
}
function gravarDados() {
    if (nome !== "" && email !== "") {
        if (operacao === "criarRegistro") {
            axios.post
                (url, { nome: nome, email: email, turma: (turma ? turma : null), idade: (idade ? idade : null), })
                .then((response) => atualizaListaComNovoUsuario(response))
                .catch((err) => console.log(err));
        } else if
            (operacao === "editarRegistro") {
            axios.put(url + id, { id: id, nome: nome, email: email, turma: (turma ? turma : null), idade: (idade ? idade : null), })
                .then((response) => atualizaListaUsuarioEditado(response))
                .catch((err) => console.log(err));
        }
    } else {
        console.log("Preencha os campos");

    }

}
function atualizaListaUsuarioEditado(response) {
    if (response.status == 202) {
        //encontra o indice do usuario a ser atualizado pelo id
        const index = usuarios.findIndex(item => item.id == id);
        //faz uma copia do array de usuarios
        let users = usuarios;
        //na copia, atualiza o usuario editado
        users[index].nome = nome;
        users[index].email = email;
        users[index].turma = turma;
        users[index].idade = idade;
        //seta os usuarios com o array editado
        setUsuarios(users);
        limparDados("");
    } else {
        console.log("Problema com edição: ", response.status);
    }
}
function atualizaListaComNovoUsuario(response) {
    console.log(response);
    let { id, nome, email, turma, idade } = response.data;
    let obj = {
        "id": id, "nome": nome, "email": email,
        "turma": turma, "idade": idade
    };
    let users = usuarios;
    users.push(obj);
    setUsuarios(users);
    limparDados("");
}
return (<div id="containerGeral">
    <button type="button" onClick={novosDados}>Novo</button>
    <input type="text"
        name="txtNome"
        value={nome}
        onChange={(e) => {
            setNome(e.target.value);
        }}
    />
    <input type="text"
        name="txtEmail"
        value={email} onChange={(e) => {
            setEmail(e.target.value);
        }}
    />
    <input type="number"
        name="txtTurma"
        value={turma}
        onChange={(e) => setTurma(e.target.value)}
    />
    <input type="number"
        name="txtIdade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
    />
    <button type="button" onClick={limparDados}>Cancelar</button>
    <button type="button" onClick={gravarDados}>Gravar</button>
    {usuarios ? usuarios.map((item) => {
        return (<div key={item.id}>
            {item.id} - {item.nome} - {item.email} - {item.turma} - {item.idade} - {" "}
            <FaPencil onClick = {(e) => editarDados(item.id)}/>
            <FaTrashCan onClick = {(e) => apagarDados(item.id)}/>
        </div>);
    })
        : false}
</div>
);
