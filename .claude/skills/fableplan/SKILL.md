---
name: fableplan
description: Plan-first workflow ("opusplan" style) — the main model plans and reviews, Sonnet subagents do the implementation. Use when the user types /fableplan or asks to plan a feature and delegate the coding to cheaper agents.
---

# fableplan — naplánuj, deleguj, zkontroluj

Pracuj ve třech fázích. Hlavní (velký) model **plánuje a kontroluje**, implementaci **delegue na Sonnet agenty**.

## 1. Plán (hlavní model)

1. Přepni se do plan modu (`EnterPlanMode`).
2. Prozkoumej codebase a případné podklady (handoffy, přílohy) sám — čti klíčové soubory, zmapuj datový model a existující vzory, které jde znovu použít.
3. Napiš konkrétní plán: co se změní, které soubory, jaké funkce/vzory se použijí, jak se výsledek ověří. Nejasnosti vyřeš přes `AskUserQuestion` PŘED dokončením plánu.
4. Nech si plán schválit (`ExitPlanMode`).

## 2. Implementace (Sonnet agenti)

Po schválení rozděl práci na samostatné, dobře ohraničené úkoly a každý zadej agentovi:

- `Agent` s `subagent_type: "general-purpose"` a `model: "sonnet"`, zpravidla `run_in_background: false`.
- Zadání piš **přesně**: cesty k souborům, přesné úpravy nebo hotové snippety, styl okolního kódu, co NESMÍ měnit, jaký syntax check spustit a co má reportovat zpět (změněné rozsahy řádků, odchylky od zadání).
- Agent **nikdy necommituje ani nepushuje** — jen edituje soubory.
- Nezávislé úkoly spouštěj paralelně; závislé postupně. Drobnosti (1–2 řádky) udělej sám, delegace se nevyplatí.

## 3. Kontrola a ověření (hlavní model)

1. Projdi celý `git diff` řádek po řádku proti plánu — zkontroluj i to, co agent tvrdí, že udělal.
2. Ověř funkčnost end-to-end (spusť aplikaci/testy, u UI screenshoty přes Playwright; v sandboxu bez sítě stubni externí služby).
3. Malé opravy udělej sám; větší vrať stejnému agentovi přes `SendMessage` s konkrétní zpětnou vazbou.
4. Teprve po kontrole a ověření commitni, pushni a založ PR. Ve shrnutí uživateli uveď, co dělal agent a co jsi ověřil.
