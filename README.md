# Planilha de Ônibus — Betel 90

Projeto de gestão de viagens e transporte construído para funcionar no **Google Planilhas**, com interface de sistema por meio do Google Apps Script.

## Fonte de verdade
O desenvolvimento deve obedecer às instruções e decisões confirmadas pelo usuário e à especificação mantida neste repositório. **Arquivos antigos não devem ser consultados, importados, copiados ou usados como referência.**

## Decisões obrigatórias
- Plataforma: Google Planilhas + Google Apps Script.
- Uso: interface com aparência e funcionamento de sistema, sem exposição normal de linhas, colunas e fórmulas.
- Visual: reproduzir fielmente as prévias visuais aprovadas pelo usuário.
- Dados iniciais: estrutura completamente vazia; todos os cadastros serão inseridos manualmente.
- Não importar dados antigos.
- Manter uma única fonte de dados por entidade, evitando cadastros e planilhas redundantes.
- Preservar histórico; cancelamentos e retiradas alteram status, não apagam registros.
- Não excluir dados nem publicar alterações em produção sem autorização.
- Registrar versões e mudanças neste repositório.

## Documentos
- [Especificação funcional](docs/ESPECIFICACAO_FUNCIONAL.md)
- [Arquitetura técnica](docs/ARQUITETURA_TECNICA.md)
- [Instalação no Google Planilhas](docs/INSTALACAO_GOOGLE_PLANILHAS.md)
- [Histórico de versões](CHANGELOG.md)

## Código
- [Backend Apps Script](apps-script/Code.gs)
- [Interface inicial](apps-script/Main.html)
- [Manifesto](apps-script/appsscript.json)

## Estado atual
Versão 0.1.0-dev.3: documentação, backend inicial, formulários, consulta/atribuição de assentos e prévia básica de resumo/ impressão no repositório. As seis consultas de listas e relatórios e a prévia com impressão A4 (retrato/paisagem) foram adicionadas ao protótipo. Ainda não existe uma planilha Google real criada ou publicada. A interface ainda não reproduz a prévia visual final aprovada; falta a gestão de status para confirmação de passageiros, testes completos e instalação na conta Google.
