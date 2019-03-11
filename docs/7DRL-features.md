The original list of features for the 7DRL version (v1.0)...

### Minimal Features for a "Game" (Essentials)

#### Dungeon

- [x] Data-based level configuration
- [x] Stairs
- [x] Ability to go down
- [x] Game seed that is used to make multiple levels with different layouts
- [x] 10 Levels

#### Monsters

- [x] monster data
- [x] Random monster generation based on data
- [x] Enemy move-to based on sight range / path range
- [x] Stop actors from occupying the same space

#### Basic Combat

- [x] Hit points
- [x] Death check for actors
- [x] Simple Bump combat (-1 HP per bump)
- [x] Wait with space or \`/~
- [x] Passable corpses

#### Sunstone

- [x] Sunstone item (data)
- [x] Pedestal prop/item
- [x] Item generation for level
- [x] Ability to pick up items
- [x] Ability to drop item
- [x] Intro text to explain plot
- [x] Ability to pick item off of a prop
- [x] End-game trigger when placing item onto extractor

### Desired Wishlist (Things that will make the game more complete)

#### UI

- [x] Display hitpoints
- [x] Show level number / progress on the UI
- [x] Display maneuvers on right

#### Combat System

- [x] Melee points (positioning, strike)
- [x] Balance points (footwork)
- [x] Endurance points
- [x] Actions:
    - [x] Move
    - [x] Attack ("bump" / move onto enemy)
	- [x] Wait (Space)
        - [x] Recovery - gain +1 points in all catagories if waiting and not attacked
	    - [ ] Survey - gain info on enemies if waiting and not attacked
- [x] Active choice:
    - [x] Lunge/Strike - costs melee, does extra damage
	- [x] Spin - costs balance, switches positions with enemy
    - [x] Feint - costs: melee and no damage, if you "hit" than you gain 1 melee point, enemy loses 1 melee or balance point
	- [x] Push - costs endurance but attacks push (extra damage if nowhere to push to?)
	- [x] Reprise - costs melee, but does an extra attack on enemies that retreat (if no retreat, melee is still lost)
	- [x] Insistence - costs endurance, but bypasses parries (if no parry, end is still lost)
	- [x] Sweep - cost: no damage and endurance, but knocks back all enemies around
- [x] Reflex (passive) choice:
    - [x] Parry\* -- costs Melee to avoid attack (requires a weapon)
	- [x] Dodge\* -- costs Balance to avoid attack (requires one free space)
	- [x] Endure\* -- costs Endurance to absorb the hit
	- [x] Retreat -- moves backwards to avoid attack
	- [x] Counter-Strike -- attack, costs Melee
	- [x] Clear -- moves back attacker, costs endurance
	- [x] Stonefeet -- costs Endurance to avoid movement effects

#### Leveling

- [x] Ability to go up stairs
- [x] "Level up" - gain +1 point and a new action for each level that is explored
- [x] Show description of level when going up/down

#### Extra Combat

- [x] Handle pushing past if on same faction moving past
- [x] Monster wandering
- [x] Fleeing AI (just random for now)
- [x] Random order for actions

#### Other

- [x] Lighting / visibility range based on sunstone
- [x] Starting level ("Town") - partially explored
- [x] Title screen

