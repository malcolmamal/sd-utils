import { v4 } from 'uuid';

import { Styles } from '../styles/styles';

export class PromptToCategoryMapper {
  public static classify(prompt: string): string {
    const contains = (textValue: string, words: string[]): boolean =>
      words.every((el) => {
        return textValue.match(new RegExp(el, 'i'));
      });

    const man = 'sks person';
    const woman = 'sks woman';

    const containsMan = (textValue: string, words: string[] = []): string => {
      return contains(textValue, [...words, man]) ? prompt : '';
    };
    const containsWoman = (textValue: string, words: string[] = []): string => {
      return contains(textValue, [...words, woman]) ? prompt : '';
    };

    switch (prompt) {
      case containsWoman(prompt, [
        'Hasselblad',
        'Lonesome',
        'topless',
        'Moody',
      ]): {
        return Styles.WOMAN_TOPLESS_MOODY;
      }
      case containsWoman(prompt, ['topless', 'bokeh', 'naked', 'sharp']): {
        return Styles.WOMAN_NAKED_BOKEH_STEROIDS;
      }
      case containsWoman(prompt, ['topless', 'bokeh']): {
        return Styles.WOMAN_NAKED_BOKEH;
      }
      case containsWoman(prompt, ['spreading her legs with her legs spread']): {
        return Styles.WOMAN_PYROS_POV_A;
      }
      case containsWoman(prompt, ['topless', 'pose study']): {
        return Styles.WOMAN_NAKED;
      }
      case containsWoman(prompt, [
        'topless',
        'feminine',
        'epic',
        'studio lighting',
        'hyperrealistic',
      ]): {
        return Styles.WOMAN_TOPLESS_ARTISTIC;
      }
      case containsWoman(prompt, ['topless']): {
        return Styles.WOMAN_CASUAL_NUDE;
      }
      case containsWoman(prompt, ['naked']): {
        return Styles.WOMAN_UNKNOWN_NAKED;
      }
      case containsWoman(prompt, ['nude']): {
        return Styles.WOMAN_UNKNOWN_NUDE;
      }
      case containsWoman(prompt, ['vagina']): {
        return Styles.WOMAN_UNKNOWN_NAKED;
      }
      case containsWoman(prompt, ['1930s']): {
        return Styles.WOMAN_YEAR_1930;
      }
      case containsWoman(prompt, ['rapunzel', 'disney', 'studio ghibli']): {
        return Styles.WOMAN_RAPUNZEL;
      }
      case containsWoman(prompt, [
        'film still',
        'neon operator',
        'blade runner',
        'inceoglu',
        'pyromallis',
      ]): {
        return Styles.WOMAN_CYBERPUNK_PYROMALLIS;
      }
      case containsWoman(prompt, ['twin peaks', 'movie poster']): {
        return Styles.WOMAN_POSTER_TWIN_PEAKS;
      }
      case containsWoman(prompt, ['Poster', 'artwork', 'maya takamura']): {
        return Styles.WOMAN_POSTER_MAYA_TAKAMURA;
      }
      case containsWoman(prompt, [
        'white haired',
        'goddess',
        'fantasy',
        'portrait',
      ]): {
        return Styles.WOMAN_PORTRAIT_WHITE_HAIR_GODDESS;
      }
      case containsWoman(prompt, ['portrait', 'yoji shinkawa', 'artstation']): {
        return Styles.WOMAN_PORTRAIT_YOJI_SHINKAWA;
      }
      case containsWoman(prompt, [
        'baroque oil painting',
        'illustration',
        'makoto shinkai',
        'takashi takeuchi',
      ]): {
        return Styles.WOMAN_PORTRAIT_MAKOTO_SHINKAI;
      }
      case containsWoman(prompt, ['modern portrait', 'rainbow colours']): {
        return Styles.WOMAN_PORTRAIT_MODERN_RAINBOW;
      }
      case containsWoman(prompt, ['illustration', 'red dress', 'wlop']): {
        return Styles.WOMAN_PORTRAIT_RED_DRESS;
      }
      case containsWoman(prompt, ['painting', 'battle armor', 'olive skin']): {
        return Styles.WOMAN_PORTRAIT_BATTLE_ARMOR;
      }
      case containsWoman(prompt, [
        'drunken',
        'delirium',
        'hallucinating',
        'constellations',
      ]): {
        return Styles.WOMAN_DELIRIUM_CONSTELLATIONS;
      }
      case containsWoman(prompt, [
        'masterpiece',
        'colorful liquid oil paint',
        'Michael Garmash',
      ]): {
        return Styles.WOMAN_PAINTING_LIQUID_OIL;
      }
      case containsWoman(prompt, ['Moody', 'Lonesome', 'Hasselblad']): {
        return Styles.WOMAN_MOODY_HASELBLAD;
      }
      case containsWoman(prompt, ['peter lindbergh', 'portrait']): {
        return Styles.WOMAN_PORTRAIT_PETER_LIDBERGH;
      }
      case containsWoman(prompt, ['arctic fox spirit']): {
        return Styles.WOMAN_PAINTING_ARCTIC_SPIRIT;
      }
      case containsWoman(prompt, ['magic celestial', 'transparent']): {
        return Styles.WOMAN_PAINTING_CELESTIAL;
      }
      case containsWoman(prompt, ['mischievous', 'queen of elves']): {
        return Styles.WOMAN_PORTRAIT_QUEEN_OF_ELVES;
      }
      case containsWoman(prompt, ['masterpiece', 'jean-baptiste monge']): {
        return Styles.WOMAN_PORTRAIT_JEAN_BAPTISTE_MONGE;
      }
      case containsWoman(prompt, ['sensual', 'irezumi tattoos']): {
        return Styles.WOMAN_IREZUMI_TATTOOS;
      }
      case containsWoman(prompt, ['flat colors', 'watercolors']): {
        return Styles.WOMAN_PAINTING_WATERCOLOR;
      }
      case containsWoman(prompt, [
        'flat colors',
        'multicolored',
        'russ mills',
      ]): {
        return Styles.WOMAN_PAINTING_RUSS_MILLS;
      }
      case containsWoman(prompt, ['croptop', 'josan gonzales']): {
        return Styles.WOMAN_PORTRAIT_JOSAN_GONZALES;
      }
      case containsWoman(prompt, ['pudge', 'elegant', 'highly detailed']): {
        return Styles.WOMAN_PAINTING_ELEGANT_PUDGE;
      }
      case containsWoman(prompt, ['portrait', 'realistic', 'Jeremy Lipking']): {
        return Styles.WOMAN_PORTRAIT_JEREMY_LIPKING;
      }
      case containsWoman(prompt, [
        'feminine',
        'epic',
        'hyperrealistic',
        'pores',
      ]): {
        return Styles.WOMAN_FEMININE_SUPERHERO;
      }
      case containsWoman(prompt, ['lingerie']): {
        return Styles.WOMAN_LINGERIE;
      }
      case containsWoman(prompt, ['delirium']): {
        return Styles.WOMAN_DELIRIUM;
      }
      case containsWoman(prompt, ['female dr strange']): {
        return Styles.WOMAN_DR_STRANGE;
      }
      case containsWoman(prompt, ['dominatrix']): {
        return Styles.WOMAN_DOMINATRIX;
      }
      case containsWoman(prompt, ['leather jacket']): {
        return Styles.WOMAN_LEATHER_JACKET;
      }
      case containsWoman(prompt, ['spirograph']): {
        return Styles.WOMAN_SPIROGRAPH;
      }
      case containsWoman(prompt, ['cyberpunk', 'neon', 'reflective']): {
        return Styles.WOMAN_NEON_CYBERPUNK;
      }
      case containsWoman(prompt, ['leather', 'armor']): {
        return Styles.WOMAN_ARMOR;
      }
      case containsWoman(prompt, ['winged', 'firemancer']): {
        return Styles.WOMAN_WINGED_FIREMANCER;
      }
      case containsWoman(prompt, ['firemancer', 'fire in hands']): {
        return Styles.WOMAN_FIREMANCER;
      }
      case containsWoman(prompt, ['Agnes Cecile']): {
        return Styles.WOMAN_AGNESS_CECILE;
      }
      case containsWoman(prompt, ['Sung Choi', 'Mitchell Mohrhauser']): {
        return Styles.WOMAN_FANCY_PAINTING;
      }
      case containsWoman(prompt, ['Flora Borsi']): {
        return Styles.WOMAN_FLORA_BORSI;
      }
      case containsWoman(prompt, ['makoto shinkai', 'dreamy eyes']): {
        return Styles.WOMAN_ANIME;
      }
      case containsWoman(prompt, ['anime illustration']): {
        return Styles.WOMAN_ANIME_ILLUSTRATION;
      }
      case containsWoman(prompt, [
        'intricate',
        'gothic clothing',
        'victoria secret',
      ]): {
        return Styles.WOMAN_INTRICATE;
      }
      case containsWoman(prompt, ['beautiful eyes', 'fantasy art']): {
        return Styles.WOMAN_INTERESTING_PORTRAIT;
      }
      case containsWoman(prompt, ['samurai', 'katana']): {
        return Styles.WOMAN_SAMURAI;
      }
      case containsWoman(prompt, ['bokeh']): {
        return Styles.WOMAN_BOKEH;
      }
      case containsWoman(prompt, ['detailed face']): {
        return Styles.WOMAN_NORMAL;
      }
      case containsWoman(prompt): {
        return Styles.WOMAN_UNKNOWN;
      }
      case containsMan(prompt, ['masculine', 'epic', 'hyperrealistic']): {
        return Styles.MAN_MASCULINE_SUPERHERO;
      }
      case containsMan(prompt, ['disney', 'studio ghibli']): {
        return Styles.MAN_DISNEY;
      }
      case containsMan(prompt, ['handsome', 'firemancer']): {
        return Styles.MAN_FIREMANCER;
      }
      case containsMan(prompt, ['Moody', 'Lonesome', 'Hasselblad']): {
        return Styles.MAN_MOODY_HASELBLAD;
      }
      case containsMan(prompt, ['samurai', 'katana']): {
        return Styles.MAN_SAMURAI;
      }
      case containsMan(prompt, ['conan the barbarian']): {
        return Styles.MAN_BARBARIAN;
      }
      case containsMan(prompt, ['blade runner', 'cyberpunk']): {
        return Styles.MAN_CYBERPUNK_BLADE_RUNNER;
      }
      case containsMan(prompt, ['bokeh']): {
        return Styles.MAN_BOKEH;
      }
      case containsMan(prompt, ['intricate']): {
        return Styles.MAN_INTRICATE;
      }
      case containsMan(prompt, ['detailed face']): {
        return Styles.MAN_NORMAL;
      }
      case containsMan(prompt): {
        return Styles.MAN_UNKNOWN;
      }
      default:
        return `${Styles.UNKNOWN} - ${v4().slice(0, 8)}`;
    }
  }

  public static isNaked(prompt: string): boolean {
    return [
      'naked',
      'nude',
      'topless',
      'spreading her legs',
      'pussy',
      'vagina',
    ].some((element) => prompt.includes(element));
  }
}
