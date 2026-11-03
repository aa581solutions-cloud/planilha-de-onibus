# Planilha de Ônibus — Betel 90

Projeto de uma solução de gestão de viagens e transporte construída para funcionar continuamente no **Google Planilhas**, com interface de sistema por meio do Google Apps Script.

## Fonte de verdade

O desenvolvimento deve obedecer às instruções e decisões confirmadas pelo usuário e à especificação mantida neste repositório. **Arquivos antigos não devem ser consultados, importados, copiados ou usados como referência.**

## Decisões obrigatórias

- Plataforma: Google Planilhas + Google Apps Script.
- Uso: interface com aparência e funcionamento de sistema, sem exposição normal de linhas, colunas e fórmulas.
- Visual: reproduzir fielmente as prévias visuais aprovadas pelo usuário.
- Dados iniciais: estrutura completamente vazia; todos os cadastros serão inseridos manualmente pelo usuário.
- Não importar dados antigos, inclusive listas de pessoas ou participações.
- Manter uma única fonte de dados por entidade, evitando cadastros e planilhas redundantes.
- Preservar histórico; cancelamentos e retiradas alteram status, não apagam registros.
- Não excluir dados nem publicar alterações em produção sem autorização.
- Registrar versões e mudanças neste repositório.

## Documentação

- [Especificação funcional e decisões](docs/ESPECIFICACAO_FUNCIONAL.md)

## Estado inicial

Repositório de desenvolvimento iniciado com documentação. A aplicação ainda não foi implementada nem publicada.
