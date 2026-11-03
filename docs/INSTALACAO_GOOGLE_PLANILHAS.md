# Instalação no Google Planilhas — desenvolvimento

## Situação
O repositório contém o código-fonte inicial. Ainda não existe uma planilha criada na conta Google do usuário, nem Apps Script autorizado ou publicado. Esta documentação não afirma que a aplicação já esteja online.

## Preparação manual
1. Crie uma planilha Google vazia para o projeto.
2. Abra **Extensões → Apps Script**.
3. No projeto Apps Script, substitua o conteúdo de `Code.gs` pelo arquivo `apps-script/Code.gs` deste repositório.
4. Crie um arquivo HTML chamado `Main` e copie o conteúdo de `apps-script/Main.html`.
5. Em **Configurações do projeto**, ajuste o fuso horário para `America/Sao_Paulo`.
6. Salve o projeto e volte à planilha.
7. Atualize a página. No menu **Betel 90**, escolha **Preparar estrutura**.
8. Autorize os escopos solicitados pelo Google, após conferir o código e a conta em que está executando.
9. No menu **Betel 90**, escolha **Abrir painel**.

## O que a preparação faz
Cria as abas e cabeçalhos previstos, se ainda não existirem. Não preenche cadastros e não limpa abas existentes. Se encontrar cabeçalhos divergentes, interrompe a preparação daquela estrutura com erro em vez de sobrescrever silenciosamente.

## Limitações desta versão
- A interface é um protótipo funcional inicial, não a reprodução final da prévia visual aprovada.
- Ainda faltam formulários de edição e testes completos. A gestão de status PENDENTE/CONFIRMADO foi adicionada ao painel de relatórios. As seis consultas de relatórios e a pré-visualização com impressão A4 foram adicionadas ao código, mas ainda precisam ser validadas em uma planilha Google real.
- Não executar em planilhas com dados reais antes de validar em uma cópia de teste.
- O usuário deve manter a planilha oficial vazia até concluir os testes.

## Próxima etapa
Testar as operações em uma planilha descartável de desenvolvimento, corrigir os resultados e então concluir interface, assentos e relatórios. A planilha oficial de uso só deve ser preparada após autorização do usuário.
