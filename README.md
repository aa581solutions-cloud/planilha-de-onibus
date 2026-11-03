# Sistema de Viagens

Projeto de gestão de viagens e transporte construído para funcionar no Google Planilhas, com interface de sistema por meio do Google Apps Script.

## Fonte de verdade
O desenvolvimento deve obedecer às instruções e decisões confirmadas pelo usuário e à especificação mantida neste repositório. Arquivos antigos não devem ser usados como fonte de dados, lógica ou funcionalidades. As três imagens enviadas ao repositório em 03/11/2026 são as referências visuais oficiais de layout, documentadas em [docs/REFERENCIA_VISUAL.md](docs/REFERENCIA_VISUAL.md).

## Decisões obrigatórias
- Plataforma: Google Planilhas + Google Apps Script.
- Nome oficial: Sistema de Viagens.
- Uso: interface com aparência e funcionamento de sistema, sem exposição normal de linhas, colunas e fórmulas.
- Visual: reproduzir fielmente as três prévias oficiais, mantendo a identidade oficial Sistema de Viagens.
- Dados iniciais: estrutura completamente vazia; todos os cadastros serão inseridos manualmente.
- Não importar dados antigos.
- Manter uma única fonte de dados por entidade, evitando cadastros e planilhas redundantes.
- Preservar histórico; cancelamentos e retiradas alteram status, não apagam registros.
- Não excluir dados nem publicar alterações em produção sem autorização.
- Registrar versões e mudanças neste repositório.

## Documentos
- [Especificação funcional](docs/ESPECIFICACAO_FUNCIONAL.md)
- [Arquitetura técnica](docs/ARQUITETURA_TECNICA.md)
- [Referências visuais oficiais — 03/11/2026](docs/REFERENCIA_VISUAL.md)
- [Instalação no Google Planilhas](docs/INSTALACAO_GOOGLE_PLANILHAS.md)
- [Histórico de versões](CHANGELOG.md)

## Código
- [Backend Apps Script](apps-script/Code.gs)
- [Interface do sistema](apps-script/Main.html)
- [Manifesto](apps-script/appsscript.json)

## Estado atual
Versão 0.1.0-dev.4: interface reconstruída com navegação lateral e telas de painel, pessoas, viagens, inscrições, pagamentos, veículos, assentos, relatórios, pesquisa e configurações; identidade textual alterada para Sistema de Viagens. Backend preservado, com atualização da identificação e versão. A interface ainda não foi executada nem validada em uma planilha Google real. Algumas áreas visuais das referências (foto/endereço de pessoa e configurações persistentes, por exemplo) ainda dependem de ampliação do modelo de dados/backend. Não considerar pronto ou publicado.
