# Histórico de versões

## 0.1.0-dev.3 — 2026-11-03
- Criada consulta central para seis documentos: lista geral, por veículo/assento, capitão, pagamentos, confirmados e resumo geral.
- Interface de relatórios passou a permitir selecionar o documento e visualizar a prévia antes de imprimir.
- Impressão configurada para papel A4, com orientação retrato ou paisagem.
- Corrigido erro de sintaxe na montagem da lista de participantes do formulário de pagamentos.
- Datas dos relatórios convertidas para texto antes do retorno à interface.
- Adicionado controle na interface para marcar participantes como PENDENTE ou CONFIRMADO; a lista de confirmados passa a utilizar esse status.
- Implementação ainda não executada em uma planilha Google real.

## Referências visuais oficiais — 2026-11-03
- Confirmadas as três imagens enviadas pelo usuário como referências visuais oficiais.
- Atualizados README e docs/REFERENCIA_VISUAL.md para apontar às imagens preservadas na raiz do repositório.
- A referência HTML antiga index(3).html não corresponde às prévias de hoje e não deve orientar a implementação visual.
- Nenhuma imagem foi editada; nenhum dado antigo foi importado; código DEV e funcionalidades existentes foram preservados.

## 0.1.0-dev.2 — 2026-11-03
- Incluídos formulários iniciais de pessoas, viagens, inscrições, veículos e pagamentos.
- Incluída consulta do mapa de assentos e atribuição de lugar.
- Incluída prévia básica de resumo da viagem e impressão pelo navegador.
- Acrescentada consulta do mapa de assentos e escape de dados exibidos em HTML.
- Corrigida realocação de participante para liberar o assento anterior.
- Adicionado roteiro de testes manuais.
- Ainda não há planilha Google real criada ou publicada.
- Interface ainda não reproduz a prévia visual final aprovada; listas completas e testes permanecem pendentes.

## 0.1.0-dev.1 — 2026-11-03
- Criada a documentação inicial e arquitetura técnica.
- Criado backend Apps Script com preparação não destrutiva da estrutura.
- Criadas operações iniciais para pessoas, viagens, inscrições, pagamentos e veículos/assentos.
- Criada interface lateral protótipo com formulários de cadastro.
- Nenhum dado de pessoas ou viagens foi inserido.
