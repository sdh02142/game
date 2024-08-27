import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { start } from "./server.js";

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 10;
  }

  attack() {
    // 플레이어의 공격
    return this.atk
  }

  critical() {
    let pluck = Math.random()*100;
    if (pluck <= 50){
      return this.atk*2;
    } else if (pluck <= 95) {
      return this.atk;
    } else {
      return Math.ceil(this.atk/4);
    };
  }

  defence(){
    let pluck3 = Math.random()*100;
    if (pluck3 <= 70){
      return true;
    } else {
      return false;
    }
  }

  run(){
    let pluck2 = Math.random()*100;
    if (pluck2 <= 50){
      return true;
    } else {
      return false;
    }
  }
}

class Monster {
  constructor(stage) {
    this.hp = Math.round(100 + (stage - 1) * 16.67);
    this.atk = Math.round(10 + (stage - 1) * 1.67);
  }

  attack() {
    let mluck = Math.random()*100;
    if (mluck <= 15) {
      return Math.ceil(this.atk*1.8);
    } else {
      return this.atk;
    };
  }

  penalty() {
    return this.atk*3;
  }

  kill() {
    this.hp = this.hp - this.hp;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=========================================== Current Status ===========================================\n`));
  console.log(
    chalk.cyanBright(`| Stage : ${stage} |`) +
    chalk.blueBright(
      `| 플레이어  hp : ${player.hp}  atk : ${player.atk}-${player.atk*2} |`,
    ) +
    chalk.redBright(
      `| 몬스터  hp : ${monster.hp}  atk : ${monster.atk}-${Math.ceil(monster.atk*1.8)} |`,
    ),
  );
  console.log(chalk.magentaBright(`\n======================================================================================================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 일반 공격  2. 크리티컬 어택(성공률 50% , 실패율 5%)  3. 방패들기(성공율 70%, 숨고르기 확률 15%)`,
      ),
    );
    console.log(
      chalk.green(
        `9. 도망치기(성공률 50%, 패널티 확률 70%)`,
      ),
    );
    console.log(
      chalk.green(
        `                                                                                0. 로비로 돌아가기`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리

    switch (choice) {
      case '1':
        logs.push(chalk.green(`공격을 선택하셨습니다.`));
        monster.hp -= player.attack();
        logs.push(chalk.green(`monster에게 ${player.attack()}의 데미지를 줍니다.`));
        if (monster.hp <= 0) {
          monster.hp = 0;
          break;
        };
        let matk = monster.attack();
        player.hp -= matk;
        logs.push(chalk.red(`${matk}의 데미지를 받았습니다.`));
        // 여기에서 새로운 게임 시작 로직을 구현
        break;
      case '2':
        logs.push(chalk.green(`크리티컬 어택을 선택하셨습니다.`));
        let pcri = player.critical();
        monster.hp -= pcri;
        logs.push(chalk.green(`monster에게 ${pcri}의 데미지를 줍니다.`));
        if (monster.hp <= 0) {
          monster.hp = 0;
          break;
        };
        let matk2 = monster.attack();
        player.hp -= matk2;
        logs.push(chalk.red(`${matk2}의 데미지를 받았습니다.`));
        break;
      case '3':
        if(player.defence()){
          logs.push(chalk.yellow('몬스터의 공격을 방어했습니다!'));
          let pluck4 = Math.random()*100;
          if(pluck4 <= 15) {
            player.hp += 15;
            logs.push(chalk.green(`숨고르기에 성공하여 15 회복했습니다!`));
          };
        } else {
          logs.push(chalk.magentaBright('방어에 실패했습니다!'));
          let matk3 = monster.attack();
          player.hp -= matk3;
          logs.push(chalk.red(`${matk3}의 데미지를 받았습니다.`));
        };
        break;
      case '9':
        if(player.run()) {
          monster.kill();
          logs.push(chalk.yellow('도망치기에 성공했습니다!'));
        } else {
          logs.push(chalk.magentaBright('도망치기에 실패했습니다!'));
          let pluck5 = Math.random()*100;
          if (pluck5 <= 70) {
          player.hp -= monster.penalty();
          logs.push(chalk.red(`패널티로 ${monster.penalty()}의 데미지를 받았습니다.`));
        };
        };
        break;
      case '0':
        console.log(chalk.magentaBright('1을 입력하시면 로비로 돌아갑니다.'));
        const choice3 = readlineSync.question('잘못 누르셨다면 1을 제외한 아무 키를 입력해주세요. ');
        if (choice3 === '1') {
          start();
        };
        break;
      default:
        logs.push(chalk.red('올바른 입력을 해주세요.'));
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
      console.log('클리어를 축하합니다! Thank you for playing!');
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