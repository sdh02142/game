import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { start } from "./server.js";

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 10;
    this.maxatk = this.atk*2;
  }

  attack() {
    // 플레이어의 공격
    return this.atk
  }

  critical() {
    
  }
}

class Monster {
  constructor(stage) {
    this.hp = Math.round(100 + (stage - 1) * 16.67);
    this.atk = Math.round(10 + (stage - 1) * 1.67);;
  }

  attack() {
    // 몬스터의 공격
    return this.atk
  }

  critical() {

  }

  kill() {
    this.hp = this.hp - this.hp;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n===================================== Current Status =====================================`));
  console.log(
    chalk.cyanBright(`| Stage : ${stage} |`) +
    chalk.blueBright(
      `| 플레이어  hp : ${player.hp}  atk : ${player.atk} |`,
    ) +
    chalk.redBright(
      `| 몬스터  hp : ${monster.hp}  atk : ${monster.atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`==========================================================================================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망친다`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}을(를) 선택하셨습니다.`));

    switch (choice) {
      case '1':
        monster.hp -= player.attack();
        logs.push(chalk.green(`monster에게 ${player.attack()}의 데미지를 줍니다.`));
        if (monster.hp <= 0) {
          monster.hp = 0;
          break;
        }
        player.hp -= monster.attack();
        logs.push(chalk.red(`${monster.attack()}의 데미지를 받았습니다.`));
        // 여기에서 새로운 게임 시작 로직을 구현
        break;
      case '9':
        logs.push(chalk.yellow('도망치기에 성공했습니다!'));
        monster.kill();
        break;
      case '7':
        player.hp -= monster.attack();
        logs.push(chalk.red(`${monster.attack()}의 데미지를 받았습니다.`))
        // 옵션 메뉴 로직을 구현
        break;
      case '0':
        console.log(chalk.magentaBright('1을 입력하시면 로비로 돌아갑니다.'));
        const choice3 = readlineSync.question('잘못 누르셨다면 아무 키를 입력해주세요. ');
        if (choice3 === '1') {
          start();
        }
        // 게임 종료 로직을 구현
        break;
      default:
        logs.push(chalk.red('올바른 입력을 해주세요.'));
      //handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    };

    if (monster.hp <= 0) {
      console.clear();
      displayStatus(stage, player, monster);
      logs.forEach((log) => console.log(log));
      console.log(
        chalk.cyan(
          figlet.textSync(`${stage} stage clear!`, {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
          })
        )
      );
      while (stage < 10) {
        console.log(chalk.blue('다음 스테이지로 넘어갑니다.'));
        const choice4 = readlineSync.question('1을 입력해주세요. ');
        if (choice4 === '1') {
          break;
        } else {
          console.log(chalk.red('올바른 입력을 해주세요.'));
        };
      };
      break;
    };
    if(player.hp <= 0){
      player.hp = 0;
      console.clear();
      displayStatus(stage, player, monster);
      logs.forEach((log) => console.log(log));
      console.log(
        chalk.redBright(
          figlet.textSync(`GAME OVER`, {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
          })
        )
      );
      while (stage < 10) {
        const choice2 = readlineSync.question('메인화면으로 돌아가시려면 1을 입력해주세요. ');
        switch (choice2) {
          case '1':
            start();
            break;
          default:
            console.log(chalk.red('올바른 입력을 해주세요.'));
        };
      };
    };
  };

};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);
    player.hp = Math.ceil(100 + (stage * 22.2));
    player.atk = Math.ceil(10 + (stage * 2.22));
    // 스테이지 클리어 및 게임 종료 조건
    // setInterval();
    stage++;
  };
  // 게임 종료

  while (stage >= 11) {
    console.log(
      chalk.cyan(
        figlet.textSync('ALL CLEAR! VICTORY!!', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default'
        })
      )
    );
    while (stage >= 11) {
      const choice2 = readlineSync.question('메인화면으로 돌아가시려면 1을 입력해주세요. ');
      switch (choice2) {
        case '1':
          start();
          break;
        default:
          console.log(chalk.red('올바른 입력을 해주세요.'));
      };
    };
  };
};