# Runestar: Origins

Based on the _Dwarves-in-Space_ setting from the [Runestar micro-RPG](http://deathraygames.com/tabletop-roleplaying/runestar/RuneStar_v1.pdf) ([pdf](http://deathraygames.com/tabletop-roleplaying/runestar/RuneStar_v1.pdf), [rpggeek](https://rpggeek.com/rpgitem/190198/runestar)), this game is meant to tell the tale of the origins of the space-faring society through a dungeon-delving Rougelike.

This game began as a 7DRL game, starting from the rote-js "Pedro" demo, and included many modifications to the rote-js libraries along the way.

## Play it now

* [Play the most recent version on GitHub](https://deathraygames.github.io/runestar-origins/): https://deathraygames.github.io/runestar-origins/
* [Play the "official 7DRL released" version on itch.io](https://deathray.itch.io/runestar-origins)
* [Play the original "demo" version on GitHub (rote repo)](https://rocket-boots.github.io/rote/demos/runestar/)
* [Look through the many other 7DRL 2019 games](https://itch.io/jam/7drl-challenge-2019/entries)

## Dependencies

Just...

* [rote js](https://github.com/rocket-boots/rote)
    - [rot.js](https://github.com/ondras/rot.js)
* A couple of OSL fonts

## Features

### Completed Features

* See [7DRL Features](docs/7DRL-features.md)

### Wishlist

Unlikely to get to these during 7DRL, but they would be great:

#### Assorted

- [ ] Character sheet
- [ ] Magic points
- [ ] Spells
- [ ] Scrolls
- [ ] Mining ability and pickax
- [ ] Animations for actions
- [ ] Multiple classes at the start: Legionnaire, Etcher, Sunstorm, Metallurgeon, Pirate, Navigator
- [ ] Skills
- Other things from the [rote readme list](../../README.md)

#### Combat

- [ ] Fix pushing past; allow pushes based on relative size and relative authority if in the same faction
- [ ] Wound effects for when out of HP
- [ ] Ranged weaponry
- [ ] Higher miss chance attacking diagnol?
- [ ] To-Hit, Crit, Dodge, Soak percentages

#### Dungeon

- [ ] Different level map generation for more uniqueness
- [ ] Tutorital / practice area of starting level
- [ ] Wall decoration (weird characters replacing "#" for some walls)
- [ ] "clearing" property for finding open spaces when placing props, items

#### Dungeon & Fun

- [ ] Fragility for the sunstone, damaged when dropped, when broken, spawn fire
- [ ] Bottle - Healing potion container
- [ ] Refill bottle at alembic
- [ ] Weights for item and prop generation
- [ ] New items for each level (even if they don't do anything yet)
- [ ] Escape ship - fixed map element added onto level 9 or 10
- [ ] Make machinery not passable but destructable

#### Story

- [ ] Spreading fire/explosion (⍦⛆⋀∭※) once the end-game is triggered
- [ ] NPC that acts as your quest-giver
- [ ] NPCs on various levels that give story/lore info
- [ ] Books and notes that give story/lore info

#### UI

- [ ] Display inventory on right
- [ ] Allow for multi-key commands (e.g. (t)hrow -> number for selection)

#### States

- [ ] Win / End of game screen
- [ ] Death screen
- [ ] Menu button and options, including links

#### Replayability

- [ ] When player dies, the sunstone is dropped and they can play a new character to pick it up
- [ ] Use sunstone to heal HP at cost of energy, decreasing it's brightness
