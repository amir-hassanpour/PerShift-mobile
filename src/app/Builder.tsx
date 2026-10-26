import { BussinessDataAccessObject } from "@/data-access/business-shifts-data/BusinessDataAccessObject";
import { BusinessShiftsRAMDisk } from "@/data-access/business-shifts-data/shift/BusinessShiftsRAMDisk";
import { ChatsDataAccessObject } from "@/data-access/chats-messages-data/ChatsDataAccessObject";
import { ChatsRAMDisk } from "@/data-access/chats-messages-data/ChatsRAMDisk";
import { TrainingsDataAccessObject } from "@/data-access/trainings/trainings-data/TraininsDataAccessObject";
import { UserRAMDisk } from "@/data-access/user-data/UserRAMDisk";
import { UserSignupDataAccessObject } from "@/data-access/user-data/UserSignupDataAccessObject";
import { AcceptBusinessRequestController } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestController";
import { AcceptBusinessRequestPresenter } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestPresenter";
import { DeclineBusinessRequestController } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestController";
import { DeclineBusinessRequestPresenter } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestPresenter";
import { LoadingMainPageController } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageController";
import { LoadingMainPagePresenter } from "@/interface-adapter/main-page/load-main-page/LoadingMainPagePresenter";
import { LoadingMainPageStates } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageState";
import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { LoadingChatPageController } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPageController";
import { LoadingChatPagePresenter } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPagePresenter";
import { LoadingChatPageViewModel } from "@/interface-adapter/messages/chat-page/LoadingChatPageViewModel";
import { NewMessageController } from "@/interface-adapter/messages/chat-page/new-message/NewMessageController";
import { NewMessagePresenter } from "@/interface-adapter/messages/chat-page/new-message/NewMessagePresenter";
import { SendMessageController } from "@/interface-adapter/messages/chat-page/send-message/SendMessageConttroller";
import { SendMessagePresenter } from "@/interface-adapter/messages/chat-page/send-message/SendMessagePresenter";
import { LoadingMessagesPageController } from "@/interface-adapter/messages/loading-messages-page/LoadingMessagesPageController";
import { LoadingMessagesPagePresenter } from "@/interface-adapter/messages/loading-messages-page/LoadingMessagesPagePresenter";
import { LoadingMessagesPageViewModel } from "@/interface-adapter/messages/LoadingMessagesPageViewModel";
import { NewChatController } from "@/interface-adapter/messages/new-chat/NewChatController";
import { NewChatPresenter } from "@/interface-adapter/messages/new-chat/NewChatPresenter";
import { NewShiftController } from "@/interface-adapter/shift/new-shift/NewShiftController";
import { NewShiftPresenter } from "@/interface-adapter/shift/new-shift/NewShiftPresenter";
import { LoadTrainingsPageController } from "@/interface-adapter/training-page/load-trainings/LoadTrainingsPageController";
import { LoadTrainingsPagePresenter } from "@/interface-adapter/training-page/load-trainings/LoadTrainingsPagePresenter";
import { LoadTrainingsPageViewModel } from "@/interface-adapter/training-page/LoadTrainingsPageViewModel";
import { NewTrainingController } from "@/interface-adapter/training-page/new-training/NewTrainingController";
import { NewTrainingPresenter } from "@/interface-adapter/training-page/new-training/NewTrainingPresenter";
import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupPresenter } from "@/interface-adapter/user/signup/UserSignupPresenter";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { ChatDataBaseSubscribe } from "@/realtime/ChatDataBaseSubscribe";
import { MessagesDataBaseSubscribe } from "@/realtime/MessagesDataBaseSubscribe";
import { ShiftDataBaseSubscribe } from "@/realtime/ShiftDataBaseSubsribe";
import { TrainingDataBaseSubscribe } from "@/realtime/TrainingDataBaseSubscribe";
import { AcceptBusinessRequestDataAccessInterface } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestDataAccessInterface";
import { AcceptBusinessRequestInteractor } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInteractor";
import { AcceptBusinessRequestOutputBoundary } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOutputBoundary";
import { DeclineBusinessRequestDataAccessInterface } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestDataAccessInterface";
import { DeclineBusinessRequestInteractor } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestInteractor";
import { DeclineBusinessRequestOutputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestOutputBoundary";
import { LoadingMainPageDataAccessInterface } from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { LoadingMainPageInteractor } from "@/usecase/main-page/loading-main-page/LoadingMainPageInteractor";
import { LoadingMainPageOutputBoundary } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputBoundary";
import { LoadingChatPageInteractor } from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageInteractor";
import { NewMessageInteractor } from "@/usecase/messages/chat-page/new-message/NewMessageInteractor";
import { SendMessageInteractor } from "@/usecase/messages/chat-page/send-message/SendMessageInteractor";
import { LoadingMessagesPageInteractor } from "@/usecase/messages/loading-messages-page/LoadingMessagesPageInteractor";
import { NewChatInteractor } from "@/usecase/messages/new-chat/NewChatInteractor";
import { NewShiftInteractor } from "@/usecase/shift/new-shift/NewShiftInteractor";
import { LoadTrainingsPageInteractor } from "@/usecase/trainings/load-trainings/LoadTrainingsPageInteractor";
import { NewTrainingInteractor } from "@/usecase/trainings/new-training/NewTrainingInteractor";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";
import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { MainPageView } from "@/view/main-page/MainPageView";
import { MainPageSlidingNavigation } from "@/view/MainPageSlidingNavigation";
import { ChatPage } from "@/view/messages/ChatPage";
import { Messages } from "@/view/messages/Messages";
import { NavigationBar } from "@/view/navigation-bar/NavigationBar";
import { TrainingPage } from "@/view/training/TrainingPage";
import { SignupView } from "@/view/user/signup/SignupView";
import { ReactElement } from "react";

export default class Builder {
  userSignupInteractor: UserSignupInteractor | undefined = undefined;
  userSignupOutputBoundary: UserSignupOutputBoundary | undefined = undefined;
  userSignupDAO: UserSignupDataAccessInterface | undefined = undefined;
  userSignupViewModel: UserSignupViewModel | undefined = undefined;
  userSignupController: UserSignupController | undefined = undefined;
  signupView: SignupView | undefined = undefined;

  laodingMainPageInteractor: LoadingMainPageInteractor | undefined = undefined;
  loadingMainPageOutputBoudnary: LoadingMainPageOutputBoundary | undefined =
    undefined;
  loadingMainPageDAO: LoadingMainPageDataAccessInterface | undefined =
    undefined;
  loadingMainPageViewModel = new LoadingMainPageViewModel(
    LoadingMainPageStates.IDLE,
  );
  laodingMainPageController: LoadingMainPageController | undefined = undefined;
  mainPageView: MainPageView | undefined = undefined;

  declineBusinessRequestInteractor:
    | DeclineBusinessRequestInteractor
    | undefined = undefined;
  declineBusinessRequestOutputBoundary:
    | DeclineBusinessRequestOutputBoundary
    | undefined = undefined;
  declineBusinessRequestDAO:
    | DeclineBusinessRequestDataAccessInterface
    | undefined = undefined;
  declineBusinessRequestController:
    | DeclineBusinessRequestController
    | undefined = undefined;

  acceptBusinessRequestInteractor: AcceptBusinessRequestInteractor | undefined =
    undefined;
  acceptBusinessRequestOutputBoundary:
    | AcceptBusinessRequestOutputBoundary
    | undefined = undefined;
  acceptBusinessRequestDAO:
    | AcceptBusinessRequestDataAccessInterface
    | undefined = undefined;
  acceptBusinessRequestController: AcceptBusinessRequestController | undefined =
    undefined;

  newShiftController: NewShiftController | undefined = undefined;
  newShiftInteractor: NewShiftInteractor | undefined = undefined;
  newShiftPresenter: NewShiftPresenter | undefined = undefined;
  businessRAMDisk: BusinessShiftsRAMDisk | undefined = undefined;

  loadingMessagesPageInteractor: LoadingMessagesPageInteractor | undefined =
    undefined;
  loadingMessagesPageDAO: ChatsDataAccessObject | undefined = undefined;
  loadingMessagesPageController: LoadingMessagesPageController | undefined =
    undefined;
  loadingMessagesPagePresenter: LoadingMessagesPagePresenter | undefined =
    undefined;
  loadingMessagesPageViewModel: LoadingMessagesPageViewModel =
    new LoadingMessagesPageViewModel();

  loadingChatPageController: LoadingChatPageController | undefined = undefined;
  loadingChatPageViewModel = new Map<string, LoadingChatPageViewModel>();
  loadingChatPageDAO: ChatsDataAccessObject | undefined = undefined;
  loadingChatPgaeInteractor: LoadingChatPageInteractor | undefined = undefined;
  loadingChatPagePresenter: LoadingChatPagePresenter | undefined = undefined;

  newMessageController: NewMessageController | undefined = undefined;
  newMessageInteractor: NewMessageInteractor | undefined = undefined;
  newMessageDAO: ChatsDataAccessObject | undefined = undefined;
  newMessagePresenter: NewMessagePresenter | undefined = undefined;

  newChatController: NewChatController | undefined = undefined;
  newChatInteractor: NewChatInteractor | undefined = undefined;
  newChatPresenter: NewChatPresenter | undefined = undefined;
  newChatOutputBoundary: NewChatPresenter | undefined = undefined;
  newChatDAO: ChatsDataAccessObject | undefined = undefined;
  newChatViewModel: LoadingMessagesPageViewModel =
    this.loadingMessagesPageViewModel;

  newMessageSubscribe: MessagesDataBaseSubscribe | undefined = undefined;
  newChatSubscribe: ChatDataBaseSubscribe | undefined = undefined;

  sendMessageOutputBoundary: SendMessagePresenter | undefined = undefined;
  sendMessageDAO: ChatsDataAccessObject | undefined = undefined;
  sendMessageInteractor: SendMessageInteractor | undefined = undefined;
  sendMessageController: SendMessageController | undefined = undefined;

  loadTrainingsPageViewModel = new LoadTrainingsPageViewModel();
  loadTrainingsPageOutputBoundary: LoadTrainingsPagePresenter | undefined =
    undefined;
  loadTrainingsPageDAO: TrainingsDataAccessObject | undefined = undefined;
  loadTrainingsPageInteractor: LoadTrainingsPageInteractor | undefined =
    undefined;
  loadTrainingsPageControler: LoadTrainingsPageController | undefined =
    undefined;

  newTrainingDAO: TrainingsDataAccessObject | undefined = undefined;
  newTrainingOutputBoundary: NewTrainingPresenter | undefined = undefined;
  newTrainingInteractor: NewTrainingInteractor | undefined = undefined;
  newTrainingController: NewTrainingController | undefined = undefined;

  makeNewTrainingSubscribe() {
    this.newTrainingDAO = new TrainingsDataAccessObject();
    this.newTrainingOutputBoundary = new NewTrainingPresenter(
      this.loadTrainingsPageViewModel,
    );
    this.newTrainingInteractor = new NewTrainingInteractor(
      this.newTrainingDAO,
      this.newTrainingOutputBoundary,
    );
    this.newTrainingController = new NewTrainingController(
      this.newTrainingInteractor,
    );

    return new TrainingDataBaseSubscribe({
      controller: this.newTrainingController,
    });
  }

  makeTrainingPage(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadTrainingsPageOutputBoundary = new LoadTrainingsPagePresenter(
      this.loadTrainingsPageViewModel,
    );
    this.loadTrainingsPageDAO = new TrainingsDataAccessObject();
    this.loadTrainingsPageInteractor = new LoadTrainingsPageInteractor(
      this.loadTrainingsPageDAO,
      this.loadTrainingsPageOutputBoundary,
    );
    this.loadTrainingsPageControler = new LoadTrainingsPageController(
      this.loadTrainingsPageInteractor,
    );

    return (
      <TrainingPage
        viewModel={this.loadTrainingsPageViewModel}
        controller={this.loadTrainingsPageControler}
      />
    );
  }

  makeNewChatSubscription() {
    this.newChatViewModel = this.loadingMessagesPageViewModel;
    this.newChatPresenter = new NewChatPresenter(this.newChatViewModel);
    this.newChatDAO = new ChatsDataAccessObject();
    this.newChatInteractor = new NewChatInteractor(
      this.newChatDAO,
      this.newChatPresenter,
    );
    this.newChatController = new NewChatController(this.newChatInteractor);

    return new ChatDataBaseSubscribe({
      controller: this.newChatController,
    });
  }

  makeChatPage = async (chat_id: string): Promise<ReactElement> => {
    const newViewModel = new LoadingChatPageViewModel();
    this.loadingChatPageViewModel.set(chat_id, newViewModel);

    this.loadingChatPagePresenter = new LoadingChatPagePresenter(newViewModel);

    this.loadingChatPageDAO = new ChatsDataAccessObject();

    this.loadingChatPgaeInteractor = new LoadingChatPageInteractor(
      this.loadingChatPageDAO,
      this.loadingChatPagePresenter,
    );

    this.loadingChatPageController = new LoadingChatPageController(
      this.loadingChatPgaeInteractor,
    );

    this.sendMessageOutputBoundary = new SendMessagePresenter(newViewModel);
    this.sendMessageDAO = new ChatsDataAccessObject();
    this.sendMessageInteractor = new SendMessageInteractor(
      this.sendMessageDAO,
      this.sendMessageOutputBoundary,
    );
    this.sendMessageController = new SendMessageController(
      this.sendMessageInteractor,
    );

    const chat = new ChatsRAMDisk();
    const getChat = await chat.getChatByID(chat_id);
    const currentUser = new UserRAMDisk();
    const getCurUser = await currentUser.getCurrentUser();

    if (getChat === undefined) {
      throw new Error("Builder can't find chat to make chat page");
    }
    if (getCurUser === null) {
      throw new Error("Buidler can't find the current user to make chat page");
    }

    return (
      <ChatPage
        chat={getChat}
        user_id={getCurUser.id}
        controller={this.loadingChatPageController}
        viewModel={newViewModel}
        sendMessageController={this.sendMessageController}
      />
    );
  };

  makeChatPageFunction() {
    return this.makeChatPage;
  }

  makeNewMessageSubscription() {
    this.newMessagePresenter = new NewMessagePresenter(
      this.loadingChatPageViewModel,
    );
    this.newMessageDAO = new ChatsDataAccessObject();

    this.newMessageInteractor = new NewMessageInteractor(
      this.newMessageDAO,
      this.newMessagePresenter,
    );
    this.newMessageController = new NewMessageController(
      this.newMessageInteractor,
    );

    return new MessagesDataBaseSubscribe({
      controller: this.newMessageController,
    });
  }

  makeLoadingMessagesController(): LoadingMessagesPageController {
    this.loadingMessagesPagePresenter = new LoadingMessagesPagePresenter(
      this.loadingMessagesPageViewModel,
    );
    this.loadingMessagesPageDAO = new ChatsDataAccessObject();
    this.loadingMessagesPageInteractor = new LoadingMessagesPageInteractor(
      this.loadingMessagesPageDAO,
      this.loadingMessagesPagePresenter,
    );
    this.loadingMessagesPageController = new LoadingMessagesPageController(
      this.loadingMessagesPageInteractor,
    );

    return this.loadingMessagesPageController;
  }

  makeMainPageSlider(showScreen: (screen: ReactElement) => void): ReactElement {
    return (
      <MainPageSlidingNavigation
        pages={[
          this.makeMainPageView(showScreen),
          this.makeMessagesPage(showScreen),
          this.makeTrainingPage(showScreen),
        ]}
        renderNavigation={({ onSelect }) => this.makeNavigationBar(onSelect)}
      />
    );
  }

  makeMessagesPage(showScreen: (screen: ReactElement) => void): ReactElement {
    return (
      <Messages
        viewModel={this.loadingMessagesPageViewModel}
        controller={this.makeLoadingMessagesController()}
        makeChatPage={this.makeChatPage}
      />
    );
  }

  makeNavigationBar(
    onSelect: (index: 0 | 1 | 2 | 3 | 4 | 5) => void,
  ): ReactElement {
    return (
      <NavigationBar
        onMessagesPress={() => {
          onSelect(1);
        }}
        onMainPress={() => {
          onSelect(0);
        }}
        onTrainingPress={() => {
          onSelect(2);
        }}
      />
    );
  }

  subscribeToRoleAssignmentRealTime(): ShiftDataBaseSubscribe {
    this.businessRAMDisk = new BusinessShiftsRAMDisk();

    this.newShiftPresenter = new NewShiftPresenter(
      this.loadingMainPageViewModel,
    );

    this.newShiftInteractor = new NewShiftInteractor(
      this.newShiftPresenter,
      this.businessRAMDisk,
    );
    this.newShiftController = new NewShiftController(this.newShiftInteractor);

    return new ShiftDataBaseSubscribe({ controller: this.newShiftController });
  }

  makeAcceptBusinessRequestUsecase(): AcceptBusinessRequestController {
    if (!this.loadingMainPageViewModel) {
      this.acceptBusinessRequestOutputBoundary =
        new AcceptBusinessRequestPresenter(
          new LoadingMainPageViewModel(LoadingMainPageStates.IDLE),
        );
    } else {
      this.acceptBusinessRequestOutputBoundary =
        new AcceptBusinessRequestPresenter(this.loadingMainPageViewModel);
    }

    this.acceptBusinessRequestDAO = new BussinessDataAccessObject();
    this.acceptBusinessRequestInteractor = new AcceptBusinessRequestInteractor(
      this.acceptBusinessRequestOutputBoundary,
      this.acceptBusinessRequestDAO,
    );
    this.acceptBusinessRequestController = new AcceptBusinessRequestController(
      this.acceptBusinessRequestInteractor,
    );

    return this.acceptBusinessRequestController;
  }

  makeDeclineBusinessRequestUsecase(): DeclineBusinessRequestController {
    if (!this.loadingMainPageViewModel) {
      this.declineBusinessRequestOutputBoundary =
        new DeclineBusinessRequestPresenter(
          new LoadingMainPageViewModel(LoadingMainPageStates.IDLE),
        );
    } else {
      this.declineBusinessRequestOutputBoundary =
        new DeclineBusinessRequestPresenter(this.loadingMainPageViewModel);
    }

    this.declineBusinessRequestDAO = new BussinessDataAccessObject();
    this.declineBusinessRequestInteractor =
      new DeclineBusinessRequestInteractor(
        this.declineBusinessRequestOutputBoundary,
        this.declineBusinessRequestDAO,
      );
    this.declineBusinessRequestController =
      new DeclineBusinessRequestController(
        this.declineBusinessRequestInteractor,
      );

    return this.declineBusinessRequestController;
  }

  makeMainPageView(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadingMainPageOutputBoudnary = new LoadingMainPagePresenter(
      this.loadingMainPageViewModel,
    );
    this.loadingMainPageDAO = new BussinessDataAccessObject();
    this.laodingMainPageInteractor = new LoadingMainPageInteractor(
      this.loadingMainPageDAO,
      this.loadingMainPageOutputBoudnary,
    );
    this.laodingMainPageController = new LoadingMainPageController(
      this.laodingMainPageInteractor,
    );

    return (
      <MainPageView
        controller={this.laodingMainPageController}
        viewModel={this.loadingMainPageViewModel}
        declineBusinessRequestController={this.makeDeclineBusinessRequestUsecase()}
        acceptBusinessRequestController={this.makeAcceptBusinessRequestUsecase()}
      />
    );
  }

  makeSignupView(showScreen: (screen: ReactElement) => void): ReactElement {
    this.userSignupViewModel = new UserSignupViewModel(UserSignupState.IDLE);
    this.userSignupOutputBoundary = new UserSignupPresenter(
      this.userSignupViewModel,
    );
    this.userSignupDAO = new UserSignupDataAccessObject();
    this.userSignupInteractor = new UserSignupInteractor(
      this.userSignupDAO,
      this.userSignupOutputBoundary,
    );
    this.userSignupController = new UserSignupController(
      this.userSignupInteractor,
    );

    let makeMainPage = async () => await this.makeMainPageView(showScreen);

    return (
      <SignupView
        userSignupController={this.userSignupController}
        userSignupViewModel={this.userSignupViewModel}
        buildMainPage={this.makeMainPageView(showScreen)}
      />
    );
  }
}
