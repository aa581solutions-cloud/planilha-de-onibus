# Changelog — Sistema de Viagens

## 0.1.0-dev.5 — 03/11/2026
- Incluídos tipo, número e órgão emissor do documento como campos opcionais no cadastro rápido e completo de pessoas.
- Criada atualização de cadastro existente para completar ou corrigir os dados posteriormente.
- Preparação da estrutura passa a acrescentar as novas colunas de documento ao final da aba PESSOAS, sem apagar os registros existentes.

# Histórico de versões

## 0.1.0-dev.4 — 2026-11-03
- Reconstruída a interface com navegação lateral e telas separadas, seguindo a composição visual das três referências oficiais.
- O painel passou a abrir em janela ampla (diálogo) em vez da barra lateral estreita do Planilhas.
- Incluídos painel principal, cadastro de pessoas, viagens, inscrição, pagamentos, veículos, mapa de assentos, relatórios, pesquisa e configurações.
- Padronizado o nome oficial do produto como Sistema de Viagens em toda a interface e documentação.
- Atualizada a identificação e versão do backend; operações e estrutura de dados anteriores foram preservadas.
- Mantidos os cadastros vazios e a regra de não importar dados antigos.
- Não houve instalação, publicação nem teste em planilha Google real.
- Campos e funções ainda não suportados pelo backend (como foto/endereço de pessoa e persistência das configurações) permanecem pendentes.

## Referências visuais oficiais — 2026-11-03
- Confirmadas as três imagens enviadas pelo usuário como referências visuais oficiais de layout.
- Confirmado o nome oficial do produto: Sistema de Viagens.
- Atualizados README e docs/REFERENCIA_VISUAL.md para apontar às imagens preservadas na raiz do repositório.
- A referência HTML antiga index(3).html não corresponde às prévias de hoje e não deve orientar a implementação visual.
- Nenhuma imagem foi editada; nenhum dado antigo foi importado.

## 0.1.0-dev.3 — 2026-11-03
- Criada consulta central para seis documentos: lista geral, por veículo/assento, capitão, pagamentos, confirmados e resumo geral.
- Interface de relatórios passou a permitir selecionar o documento e visualizar a prévia antes de imprimir.
- Impressão configurada para papel A4, com orientação retrato ou paisagem.
- Corrigido erro de sintaxe na montagem da lista de participantes do formulário de pagamentos.
- Datas dos relatórios convertidas para texto antes do retorno à interface.
- Adicionado controle na interface para marcar participantes como PENDENTE ou CONFIRMADO; a lista de confirmados passa a utilizar esse status.
- Implementação ainda não executada em uma planilha Google real.

## 0.1.0-dev.2 — 2026-11-03
- Incluídos formulários iniciais de pessoas, viagens, inscrições, veículos e pagamentos.
- Incluída consulta do mapa de assentos e atribuição de lugar.
- Incluída prévia básica de resumo da viagem e impressão pelo navegador.
- Corrigida realocação de participante para liberar o assento anterior.
- Adicionado roteiro de testes manuais.
- Ainda não há planilha Google real criada ou publicada.

## 0.1.0-dev.1 — 2026-11-03
- Criada a documentação inicial e arquitetura técnica.
- Criado backend Apps Script com preparação não destrutiva da estrutura.
- Criadas operações iniciais para pessoas, viagens, inscrições, pagamentos e veículos/assentos.
- Criada interface lateral protótipo com formulários de cadastro.
- Nenhum dado de pessoas ou viagens foi inserido.
