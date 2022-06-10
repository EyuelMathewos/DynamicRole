import { Ability, RawRuleOf } from '@casl/ability';

export const actions = ['manage', 'create', 'read', 'update', 'delete'];
export const subjects = ['Article', 'all'];

export type AppAbilities = [
  typeof actions[number],
  typeof subjects[number]
];
export type AppAbility = Ability < AppAbilities > ;

const defineAbilitiesFor = (rules: RawRuleOf < AppAbility > []) => {
  let createAbility = new Ability(rules);

  return createAbility;
};
module.exports = defineAbilitiesFor;