# App

GymPass style app.

## RFs (Requisitos funcionais) // funcionalidades da aplicação

- [x] Deve ser possível se cadastrar
- [] Deve ser possível se autenticar
- [] Deve ser possível obter o perfil de um usuário logado
- [] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [] Deve ser possível o usuário obter seu histórico de check-ins
- [] Deve ser possível o usuário buscar academias próximas
- [] Deve ser possível o usuário buscar academias pelo nome
- [] Deve ser possível o usuário realizar check-in em um academia
- [] Deve ser possível validar o chek-in de um usuário
- [] Deve ser possível cadastrar uma academia

## RNs (Regras de negocio) // caminhos que cada requisito pode tomar, sempre relacionada aos RF, não existe uma RN sem estar relacionado a um RF

- [x] O usuário não deve poder se cadastrar com e-mail duplicado
- [] O usuário não pode fazer 2 check-ins no mesmo dia
- [] O usuário não pode fazer check-in se não estiver perto (100m) da academia
- [] O check-in só pode ser validado até 20 minutos após criado
- [] O check-in só pode ser validado por administradores
- [] A academia só pode ser cadastrada por administradores

## RNFs (Regras não funcionais) // requisitos que o cliente não tem controle sendo mais nivel tecnico do que nivel de funcionalidade 

- [x] A senha do usuário precisa estar criptografado
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [] Todas listas de dados precisam estar paginadas com 20 itens por pagina
- [] O usuario deve ser identificado por um JWT (JSON Web Token)
