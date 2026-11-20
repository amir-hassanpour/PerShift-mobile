import { BussinessDataAccessObject } from "@/data-access/business-shifts-data/BusinessDataAccessObject";
import { BusinessRAMDisk } from "@/data-access/business-shifts-data/BusinessRAMDisk";
import { BusinessShiftsRAMDisk } from "@/data-access/business-shifts-data/shift/BusinessShiftsRAMDisk";
import { ChatsDataAccessObject } from "@/data-access/chats-messages-data/ChatsDataAccessObject";
import { ChatsRAMDisk } from "@/data-access/chats-messages-data/ChatsRAMDisk";
import { HoursDataAccessObject } from "@/data-access/hours-data/HoursDataAccessObject";
import { MembersDataAccessObject } from "@/data-access/members/MembersDataAccessObject";
import { ProfileDAO } from "@/data-access/profile-data-access/ProfileDAO";
import { StartupSync } from "@/data-access/startup-sync/StartupSync";
import { ModuleRAMDisk } from "@/data-access/trainings/trainings-data/ModuleRAMDisk";
import { TrainingsRAMDisk } from "@/data-access/trainings/trainings-data/TrainingsRAMDisk";
import { TrainingsDataAccessObject } from "@/data-access/trainings/trainings-data/TraininsDataAccessObject";
import { UserRAMDisk } from "@/data-access/user-data/UserRAMDisk";
import { UserSignupDataAccessObject } from "@/data-access/user-data/UserSignupDataAccessObject";
import { User } from "@/entity/User";
import { CheckHoursController } from "@/interface-adapter/hours/check-hours/CheckHoursController";
import { CheckHoursPresenter } from "@/interface-adapter/hours/check-hours/CheckHoursPresenter";
import { CheckHoursViewModel } from "@/interface-adapter/hours/check-hours/CheckHoursViewModel";
import { LoadHoursPageController } from "@/interface-adapter/hours/load-hours-page/LoadHoursPageController";
import { LoadHoursPagePresenter } from "@/interface-adapter/hours/load-hours-page/LoadHoursPgaePresenter";
import { LoadHoursPageViewModel } from "@/interface-adapter/hours/load-hours-page/LoadHoursPgaeViewModel";
import { AcceptBusinessRequestController } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestController";
import { AcceptBusinessRequestPresenter } from "@/interface-adapter/main-page/accept-business-request/AcceptBusinessRequestPresenter";
import { DeclineBusinessRequestController } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestController";
import { DeclineBusinessRequestPresenter } from "@/interface-adapter/main-page/decline-business-request/DeclineBusinessRequestPresenter";
import { LoadingMainPageController } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageController";
import { LoadingMainPagePresenter } from "@/interface-adapter/main-page/load-main-page/LoadingMainPagePresenter";
import { LoadingMainPageStates } from "@/interface-adapter/main-page/load-main-page/LoadingMainPageState";
import { LoadingMainPageViewModel } from "@/interface-adapter/main-page/LoadingMainPageViewModel";
import { NewBusinessRequestController } from "@/interface-adapter/main-page/new-business-request/NewBusinessRequestController";
import { NewBusinessRequestPresenter } from "@/interface-adapter/main-page/new-business-request/NewBusinessRequestPresenter";
import { NewBusinessController } from "@/interface-adapter/main-page/new-business/NewBusinessController";
import { NewBusinessPresenter } from "@/interface-adapter/main-page/new-business/NewBusinessPresenter";
import { AddMemberController } from "@/interface-adapter/members/add-member/AddMemberController";
import { AddMemberPresenter } from "@/interface-adapter/members/add-member/AddMemberPresenter";
import { LoadMembersPageController } from "@/interface-adapter/members/load-members-page/LoadMembersPageController";
import { LoadMembersPagePresenter } from "@/interface-adapter/members/load-members-page/LoadMembersPagePresenter";
import { LoadMembersPageViewModel } from "@/interface-adapter/members/LoadMembersPageViewModel";
import { NewMemberController } from "@/interface-adapter/members/new-member/NewMemberController";
import { NewMemberPresenter } from "@/interface-adapter/members/new-member/NewMemberPresenter";
import { ScrollMembersController } from "@/interface-adapter/members/scroll-members/ScrollMembersController";
import { ScrollMembersPresenter } from "@/interface-adapter/members/scroll-members/ScrollMembersPresenter";
import { LoadingChatPageController } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPageController";
import { LoadingChatPagePresenter } from "@/interface-adapter/messages/chat-page/load-chat-page/LoadingChatPagePresenter";
import { LoadingChatPageViewModel } from "@/interface-adapter/messages/chat-page/LoadingChatPageViewModel";
import { NewMessageController } from "@/interface-adapter/messages/chat-page/new-message/NewMessageController";
import { NewMessagePresenter } from "@/interface-adapter/messages/chat-page/new-message/NewMessagePresenter";
import { ScrollMessagesController } from "@/interface-adapter/messages/chat-page/scroll-messages/ScrollMessagesController";
import { ScrollMessagesPresenter } from "@/interface-adapter/messages/chat-page/scroll-messages/ScrollMessagesPresenter";
import { SendMessageController } from "@/interface-adapter/messages/chat-page/send-message/SendMessageConttroller";
import { SendMessagePresenter } from "@/interface-adapter/messages/chat-page/send-message/SendMessagePresenter";
import { ChatExistsController } from "@/interface-adapter/messages/create-chat/chat-exists/ChatExistsController";
import { ChatExistsPresenter } from "@/interface-adapter/messages/create-chat/chat-exists/ChatExistsPresenter";
import { ChatExistsViewModel } from "@/interface-adapter/messages/create-chat/chat-exists/ChatExistsViewModel";
import { CreateChatController } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatController";
import { CreateChatPresenter } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatPresenter";
import { CreateChatViewModel } from "@/interface-adapter/messages/create-chat/create-chat/CreateChatViewModel";
import { LoadCreateChatPageController } from "@/interface-adapter/messages/create-chat/load-create-chat-page/LoadCreateChatPageController";
import { LoadCreateChatPagePresenter } from "@/interface-adapter/messages/create-chat/load-create-chat-page/LoadCreateChatPagePresenter";
import { LoadCreateGroupchatPageController } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPageController";
import { LoadCreateGroupchatPagePresenter } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPagePresenter";
import { LoadCreateGroupchatPageViewModel } from "@/interface-adapter/messages/create-chat/load-create-group-chat-page/LoadCreateGroupchatPageViewModel";
import { LoadCreateChatPageViewModel } from "@/interface-adapter/messages/create-chat/LoadCreateChatPageViewModel";
import { LoadingMessagesPageController } from "@/interface-adapter/messages/loading-messages-page/LoadingMessagesPageController";
import { LoadingMessagesPagePresenter } from "@/interface-adapter/messages/loading-messages-page/LoadingMessagesPagePresenter";
import { LoadingMessagesPageViewModel } from "@/interface-adapter/messages/LoadingMessagesPageViewModel";
import { NewChatController } from "@/interface-adapter/messages/new-chat/NewChatController";
import { NewChatPresenter } from "@/interface-adapter/messages/new-chat/NewChatPresenter";
import { ScrollChatsController } from "@/interface-adapter/messages/scroll-chats/ScrollChatsController";
import { ScrollChatsPresenter } from "@/interface-adapter/messages/scroll-chats/ScrollChatsPresenter";
import { LoadProfilePageController } from "@/interface-adapter/profile/load-profile-page/LoadProfilePageController";
import { LoadProfilePagePresenter } from "@/interface-adapter/profile/load-profile-page/LoadProfilePagePresenter";
import { LoadProfilePageViewModel } from "@/interface-adapter/profile/LoadProfilePageViewModel";
import { CreateShiftController } from "@/interface-adapter/shift/create-shift/create-shift/CreateShiftController";
import { CreateShiftPresenter } from "@/interface-adapter/shift/create-shift/create-shift/CreateShiftPresenter";
import { LoadCreateShiftPageController } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPageController";
import { LoadCreateShiftPagePresenter } from "@/interface-adapter/shift/create-shift/load-create-shift-page/LoadCreateShiftPagePresenter";
import { LoadCreateShiftPageViewModel } from "@/interface-adapter/shift/create-shift/LoadCreateShiftPageViewModel";
import { DeleteShiftController } from "@/interface-adapter/shift/delete-shift/DeleteShiftController";
import { DeleteShiftPresenter } from "@/interface-adapter/shift/delete-shift/DeleteShiftPresenter";
import { LoadShiftsController } from "@/interface-adapter/shift/load-shifts/LoadShiftsController";
import { LoadShiftsPresenter } from "@/interface-adapter/shift/load-shifts/LoadShiftsPresenter";
import { NewShiftController } from "@/interface-adapter/shift/new-shift/NewShiftController";
import { NewShiftPresenter } from "@/interface-adapter/shift/new-shift/NewShiftPresenter";
import { UpdateShiftController } from "@/interface-adapter/shift/update-shift/UpdateShiftController";
import { UpdateShiftPresenter } from "@/interface-adapter/shift/update-shift/UpdateShiftPresenter";
import { LoadTrainingsPageController } from "@/interface-adapter/training-page/load-trainings/LoadTrainingsPageController";
import { LoadTrainingsPagePresenter } from "@/interface-adapter/training-page/load-trainings/LoadTrainingsPagePresenter";
import { LoadTrainingsPageViewModel } from "@/interface-adapter/training-page/LoadTrainingsPageViewModel";
import { NewTrainingController } from "@/interface-adapter/training-page/new-training/NewTrainingController";
import { NewTrainingPresenter } from "@/interface-adapter/training-page/new-training/NewTrainingPresenter";
import { LoadTrainingPageController } from "@/interface-adapter/training-page/training-page/laod-training-page/LoadTrainingPageController";
import { LoadTrainingPagePresenter } from "@/interface-adapter/training-page/training-page/laod-training-page/LoadTrainingPagePresenter";
import { LoadTrainingPageViewModel } from "@/interface-adapter/training-page/training-page/LoadTrainingPageViewModel";
import { NewModuleController } from "@/interface-adapter/training-page/training-page/new-module/NewModuleController";
import { NewModulePresenter } from "@/interface-adapter/training-page/training-page/new-module/NewModulePresenter";
import { UserSignupController } from "@/interface-adapter/user/signup/UserSignupController";
import { UserSignupPresenter } from "@/interface-adapter/user/signup/UserSignupPresenter";
import { UserSignupState } from "@/interface-adapter/user/signup/UserSignupState";
import { UserSignupViewModel } from "@/interface-adapter/user/signup/UserSignupViewModel";
import { BusinessDataBaseSubscribe } from "@/realtime/BusinessDataBaseSubscribe";
import { ChatDataBaseSubscribe } from "@/realtime/ChatDataBaseSubscribe";
import { MemberDataBaseSubscribe } from "@/realtime/MemberDataBaseSubscribe";
import { MessagesDataBaseSubscribe } from "@/realtime/MessagesDataBaseSubscribe";
import { ModuleDataBaseSubscribe } from "@/realtime/ModuleDataBaseSubscribe";
import { ShiftDataBaseSubscribe } from "@/realtime/ShiftDataBaseSubsribe";
import { TrainingDataBaseSubscribe } from "@/realtime/TrainingDataBaseSubscribe";
import { CheckHoursInteractor } from "@/usecase/hours/check-hours/CheckHoursInteractor";
import { LoadHoursPageInteractor } from "@/usecase/hours/load-hours-page/LoadHoursPageInteractor";
import { AcceptBusinessRequestDataAccessInterface } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestDataAccessInterface";
import { AcceptBusinessRequestInteractor } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestInteractor";
import { AcceptBusinessRequestOutputBoundary } from "@/usecase/main-page/accep-business-request/AcceptBusinessRequestOutputBoundary";
import { DeclineBusinessRequestDataAccessInterface } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestDataAccessInterface";
import { DeclineBusinessRequestInteractor } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestInteractor";
import { DeclineBusinessRequestOutputBoundary } from "@/usecase/main-page/decline-business-request/DeclineBusinessRequestOutputBoundary";
import { LoadingMainPageDataAccessInterface } from "@/usecase/main-page/loading-main-page/LoadingMainPageDataAccessInterface";
import { LoadingMainPageInteractor } from "@/usecase/main-page/loading-main-page/LoadingMainPageInteractor";
import { LoadingMainPageOutputBoundary } from "@/usecase/main-page/loading-main-page/LoadingMainPageOutputBoundary";
import { NewBusinessRequestInteractor } from "@/usecase/main-page/new-business-request/NewBusinessRequestInteractor";
import { NewBusinessInteractor } from "@/usecase/main-page/new-business/NewBusinessInteractor";
import { AddMemberInteractor } from "@/usecase/members/add-member/AddMemberInteractor";
import { LoadMembersPageInteractor } from "@/usecase/members/load-members-page/LoadMembersPageInteractor";
import { NewMemberInteractor } from "@/usecase/members/new-member/NewMemberInteractor";
import { ScrollMembersInteractor } from "@/usecase/members/scroll-members/ScrollMembersInteractor";
import { LoadingChatPageInteractor } from "@/usecase/messages/chat-page/load-chat-page/LoadingChatPageInteractor";
import { NewMessageInteractor } from "@/usecase/messages/chat-page/new-message/NewMessageInteractor";
import { ScrollMessagesInteractor } from "@/usecase/messages/chat-page/scroll-messages/ScrollMessagesInteractor";
import { SendMessageInteractor } from "@/usecase/messages/chat-page/send-message/SendMessageInteractor";
import { ChatExistsInteractor } from "@/usecase/messages/create-chat/chat_exists/ChatExistsInteractor";
import { CreateChatInteractor } from "@/usecase/messages/create-chat/create-chat/CreateChatInteractor";
import { LoadCreateChatPageInteractor } from "@/usecase/messages/create-chat/load-create-chat-page/LoadCreateChatPageInteractor";
import { LoadCreateGroupchatPageInteractor } from "@/usecase/messages/create-chat/load-create-groupchat-page/LoadCreateGroupchatPageInteractor";
import { LoadingMessagesPageInteractor } from "@/usecase/messages/loading-messages-page/LoadingMessagesPageInteractor";
import { NewChatInteractor } from "@/usecase/messages/new-chat/NewChatInteractor";
import { ScrollChatsInteractor } from "@/usecase/messages/scroll-chats/ScrollChatsInteractor";
import { LoadProfilePageInteractor } from "@/usecase/profile/load-profile-page/LoadProfilePageInteractor";
import { CreateShiftInteractor } from "@/usecase/shift/create-shift/create-shift/CreateShiftInteractor";
import { LoadCreateShiftPageInteractor } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageInteractor";
import { DeleteShiftInteractor } from "@/usecase/shift/delete-shift/DeleteShiftInteractor";
import { LoadShiftsInteractor } from "@/usecase/shift/load-shifts/LoadShiftsInteractor";
import { NewShiftInteractor } from "@/usecase/shift/new-shift/NewShiftInteractor";
import { UpdateShiftInteractor } from "@/usecase/shift/update-shift/UpdateShiftInteractor";
import { LoadTrainingsPageInteractor } from "@/usecase/trainings/load-trainings/LoadTrainingsPageInteractor";
import { NewTrainingInteractor } from "@/usecase/trainings/new-training/NewTrainingInteractor";
import { LoadTrainingPageInteractor } from "@/usecase/trainings/training-page/load-training-page/LoadTrainingPageInteractor";
import { NewModuleInteractor } from "@/usecase/trainings/training-page/new-module/NewModuleInteractor";
import { UserSignupDataAccessInterface } from "@/usecase/user/user-signup/UserSignupDataAccessInterface";
import { UserSignupInteractor } from "@/usecase/user/user-signup/UserSignupInteractor";
import { UserSignupOutputBoundary } from "@/usecase/user/user-signup/UserSignupOutputBoundary";
import { HoursPage } from "@/view/hours-page/HoursPage";
import { CreateShiftView } from "@/view/main-page/CreateShiftView";
import { MainPageView } from "@/view/main-page/MainPageView";
import { MainPageSlidingNavigation } from "@/view/MainPageSlidingNavigation";
import { MembersView } from "@/view/members/MembersView";
import { ChatPage } from "@/view/messages/ChatPage";
import CreateChatView from "@/view/messages/CreateChatView";
import CreateGroupChatView from "@/view/messages/CreateGroupChatView";
import { Messages } from "@/view/messages/Messages";
import { NavigationBar } from "@/view/navigation-bar/NavigationBar";
import NoAccessView from "@/view/no-access-view/NoAccessView";
import { ProfileView } from "@/view/profile/ProfileView";
import { ModulePage } from "@/view/training/ModulePage";
import { TrainingPage } from "@/view/training/TrainingPage";
import { TrainingsPage } from "@/view/training/TrainingsPage";
import { SignupView } from "@/view/user/signup/SignupView";
import { ReactElement } from "react";

export default class Builder {
  makeGroupChatPage: any;
  makeCreateGroupChatPage() {
    throw new Error("Method not implemented.");
  }
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

  loadTrainingPageViewModel = new Map<string, LoadTrainingPageViewModel>();
  loadTrainingPageDAO: TrainingsDataAccessObject | undefined = undefined;
  loadTrainingPageOutputBoundary: LoadTrainingPagePresenter | undefined =
    undefined;
  loadTrainingPageInteractor: LoadTrainingPageInteractor | undefined =
    undefined;
  loadTrainingPageController: LoadTrainingPageController | undefined =
    undefined;

  newModuleOutputBoundary: NewModulePresenter | undefined = undefined;
  newModuleDAO: TrainingsDataAccessObject | undefined = undefined;
  newModuleInteractor: NewModuleInteractor | undefined = undefined;
  newModuleController: NewModuleController | undefined = undefined;

  loadMembersPageViewModel = new LoadMembersPageViewModel();
  loadMembersPageOutputBoundart: LoadMembersPagePresenter | undefined =
    undefined;
  loadMembersPageDAO: MembersDataAccessObject | undefined = undefined;
  loadMembersPageInteractor: LoadMembersPageInteractor | undefined = undefined;
  loadMembersPageController: LoadMembersPageController | undefined = undefined;

  newMemberDAO: MembersDataAccessObject | undefined = undefined;
  newMemberOutputBoundary: NewMemberPresenter | undefined = undefined;
  newMemberInteractor: NewMemberInteractor | undefined = undefined;
  newMemberController: NewMemberController | undefined = undefined;

  activeIndex:
    | ["Home"]
    | ["Messages"]
    | ["Trainings"]
    | ["Members"]
    | ["Profile"]
    | ["Hours"] = ["Home"];

  loadProfilePageViewmodel: LoadProfilePageViewModel =
    new LoadProfilePageViewModel();
  loadProfilePageDAO: ProfileDAO | undefined = undefined;
  loadProfilePageOutputBoundary: LoadProfilePagePresenter | undefined =
    undefined;
  laodProfilePageInteractor: LoadProfilePageInteractor | undefined = undefined;
  loadProfilePageController: LoadProfilePageController | undefined = undefined;

  newBusinessDAO: BussinessDataAccessObject | undefined = undefined;
  newBusinessOutputBoundary: NewBusinessPresenter | undefined = undefined;
  newBusinessInteractor: NewBusinessInteractor | undefined = undefined;
  newBusinessController: NewBusinessController | undefined = undefined;

  newBusinesRequestDAO: BussinessDataAccessObject | undefined = undefined;
  newBusinessRequestOutputBoundary: NewBusinessRequestPresenter | undefined =
    undefined;
  newBusinessRequestInteractor: NewBusinessRequestInteractor | undefined =
    undefined;
  newBusinessRequestController: NewBusinessRequestController | undefined =
    undefined;

  loadCreateShiftPageViewModel: LoadCreateShiftPageViewModel =
    new LoadCreateShiftPageViewModel();
  loadCreateShiftPageOutputBoundary: LoadCreateShiftPagePresenter | undefined =
    undefined;
  loadCreateShiftPageDAO: MembersDataAccessObject | undefined = undefined;
  loadCreateShiftPageInteractor: LoadCreateShiftPageInteractor | undefined =
    undefined;
  loadCreateShiftPageController: LoadCreateShiftPageController | undefined =
    undefined;

  createShiftOuptutBoundary: CreateShiftPresenter | undefined = undefined;
  createShiftDAO: BusinessShiftsRAMDisk | undefined = undefined;
  createShiftInteractor: CreateShiftInteractor | undefined = undefined;
  createShiftController: CreateShiftController | undefined = undefined;

  loadCreateChatPageViewModel: LoadCreateChatPageViewModel =
    new LoadCreateChatPageViewModel();
  loadCreateChatPageDAO: ChatsDataAccessObject | undefined = undefined;
  loadCreateChatPageOutputBoundary: LoadCreateChatPagePresenter | undefined =
    undefined;
  loadCreateChatPageInteractor: LoadCreateChatPageInteractor | undefined =
    undefined;
  loadCreateChatPageController: LoadCreateChatPageController | undefined =
    undefined;

  createChatViewModel: CreateChatViewModel = new CreateChatViewModel();
  createChatDAO: ChatsDataAccessObject | null = null;
  createChatOutputBoundary: CreateChatPresenter | null = null;
  createChatInteractor: CreateChatInteractor | null = null;
  createChatController: CreateChatController | null = null;

  chatExistsViewModel: ChatExistsViewModel = new ChatExistsViewModel();
  chatExistsDAO: ChatsDataAccessObject | null = null;
  chatExistsOutputBoundary: ChatExistsPresenter | null = null;
  chatExistsInteractor: ChatExistsInteractor | null = null;
  chatExistsController: ChatExistsController | null = null;

  loadCreateGroupchatPageViewModel: LoadCreateGroupchatPageViewModel =
    new LoadCreateGroupchatPageViewModel();
  loadCreateGroupchatPageDAO: ChatsDataAccessObject | null = null;
  loadCreateGroupchatPageOutputBoundary: LoadCreateGroupchatPagePresenter | null =
    null;
  loadCreateGroupchatPageInteractor: LoadCreateGroupchatPageInteractor | null =
    null;
  loadCreateGroupchatPageController: LoadCreateGroupchatPageController | null =
    null;

  loadHoursPageViewModel: LoadHoursPageViewModel = new LoadHoursPageViewModel();
  loadHoursPageDAO: HoursDataAccessObject | null = null;
  loadHoursPageOutputBoundary: LoadHoursPagePresenter | null = null;
  loadHoursPageInteractor: LoadHoursPageInteractor | null = null;
  loadHoursPageController: LoadHoursPageController | null = null;

  checkHoursViewModel: CheckHoursViewModel = new CheckHoursViewModel();
  checkHoursDAO: HoursDataAccessObject | null = null;
  checkHoursOutputBoundary: CheckHoursPresenter | null = null;
  checkHoursInteractor: CheckHoursInteractor | null = null;
  checkHoursController: CheckHoursController | null = null;

  addMemberDAO: MembersDataAccessObject | null = null;
  addMemberOutputBoundary: AddMemberPresenter | null = null;
  addMemberInteractor: AddMemberInteractor | null = null;
  addMemberController: AddMemberController | null = null;

  loadShiftDAO: BussinessDataAccessObject | null = null;
  loadShiftsOutputBoundary: LoadShiftsPresenter | null = null;
  loadShiftsInteractor: LoadShiftsInteractor | null = null;
  loadShiftsController: LoadShiftsController | null = null;

  scrollMessagesDAO: ChatsDataAccessObject | null = null;
  scrollMessagesOutputBoundary: ScrollMessagesPresenter | null = null;
  scrollMessagesInteractor: ScrollMessagesInteractor | null = null;
  scrollMessagesController: ScrollMessagesController | null = null;

  scrollChatsDAO: ChatsDataAccessObject | null = null;
  scrollChatsOutputBoundary: ScrollChatsPresenter | null = null;
  scrollChatsInteractor: ScrollChatsInteractor | null = null;
  scrollChatsController: ScrollChatsController | null = null;

  scrollMembersDAO: MembersDataAccessObject | null = null;
  scrollMembersOutputBoundary: ScrollMembersPresenter | null = null;
  scrollMembersInteractor: ScrollMembersInteractor | null = null;
  scrollMembersController: ScrollMembersController | null = null;

  deleteShiftDAO: BussinessDataAccessObject | null = null;
  deleteShiftOutputBoundary: DeleteShiftPresenter | null = null;
  deleteShiftInteractor: DeleteShiftInteractor | null = null;
  deleteShiftController: DeleteShiftController | null = null;

  updateShiftDAO: BussinessDataAccessObject | null = null;
  updateShiftOutputBoundary: UpdateShiftPresenter | null = null;
  updateShiftInteractor: UpdateShiftInteractor | null = null;
  updateShiftController: UpdateShiftController | null = null;

  makeUpdateShift(): UpdateShiftController {
    this.updateShiftDAO = new BussinessDataAccessObject();
    this.updateShiftOutputBoundary = new UpdateShiftPresenter(
      this.loadingMainPageViewModel,
    );
    this.updateShiftInteractor = new UpdateShiftInteractor(
      this.updateShiftDAO,
      this.updateShiftOutputBoundary,
    );
    this.updateShiftController = new UpdateShiftController(
      this.updateShiftInteractor,
    );

    return this.updateShiftController;
  }

  makeDeleteShift(): DeleteShiftController {
    this.deleteShiftDAO = new BussinessDataAccessObject();

    this.deleteShiftOutputBoundary = new DeleteShiftPresenter(
      this.loadingMainPageViewModel,
    );

    this.deleteShiftInteractor = new DeleteShiftInteractor(
      this.deleteShiftDAO,
      this.deleteShiftOutputBoundary,
    );

    this.deleteShiftController = new DeleteShiftController(
      this.deleteShiftInteractor,
    );

    return this.deleteShiftController;
  }

  makeScrollMembers(): ScrollMembersController {
    this.scrollMembersDAO = new MembersDataAccessObject();

    this.scrollMembersOutputBoundary = new ScrollMembersPresenter(
      this.loadMembersPageViewModel,
    );

    this.scrollMembersInteractor = new ScrollMembersInteractor(
      this.scrollMembersDAO,
      this.scrollMembersOutputBoundary,
    );

    this.scrollMembersController = new ScrollMembersController(
      this.scrollMembersInteractor,
    );

    return this.scrollMembersController;
  }

  makeScrollChats(): ScrollChatsController {
    this.scrollChatsDAO = new ChatsDataAccessObject();

    this.scrollChatsOutputBoundary = new ScrollChatsPresenter(
      this.loadingMessagesPageViewModel,
    );

    this.scrollChatsInteractor = new ScrollChatsInteractor(
      this.scrollChatsDAO,
      this.scrollChatsOutputBoundary,
    );

    this.scrollChatsController = new ScrollChatsController(
      this.scrollChatsInteractor,
    );

    return this.scrollChatsController;
  }

  makeScrollMessages(chatID: string): ScrollMessagesController {
    this.scrollMessagesDAO = new ChatsDataAccessObject();

    let viewModel = this.loadingChatPageViewModel.get(chatID);

    if (viewModel === undefined) {
      viewModel = new LoadingChatPageViewModel();
      this.loadingChatPageViewModel.set(chatID, viewModel);
    }

    this.scrollMessagesOutputBoundary = new ScrollMessagesPresenter(viewModel);

    this.scrollMessagesInteractor = new ScrollMessagesInteractor(
      this.scrollMessagesDAO,
      this.scrollMessagesOutputBoundary,
    );

    this.scrollMessagesController = new ScrollMessagesController(
      this.scrollMessagesInteractor,
    );

    return this.scrollMessagesController;
  }

  makeLoadShifts(): LoadShiftsController {
    this.loadShiftDAO = new BussinessDataAccessObject();
    this.loadShiftsOutputBoundary = new LoadShiftsPresenter(
      this.loadingMainPageViewModel,
    );
    this.loadShiftsInteractor = new LoadShiftsInteractor(
      this.loadShiftDAO,
      this.loadShiftsOutputBoundary,
    );
    this.loadShiftsController = new LoadShiftsController(
      this.loadShiftsInteractor,
    );

    return this.loadShiftsController;
  }

  makeAddMember(): AddMemberController {
    this.addMemberDAO = new MembersDataAccessObject();
    this.addMemberOutputBoundary = new AddMemberPresenter(
      this.loadMembersPageViewModel,
    );
    this.addMemberInteractor = new AddMemberInteractor(
      this.addMemberOutputBoundary,
      this.addMemberDAO,
    );
    this.addMemberController = new AddMemberController(
      this.addMemberInteractor,
    );

    return this.addMemberController;
  }

  makeHoursPage(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadHoursPageDAO = new HoursDataAccessObject();
    this.loadHoursPageOutputBoundary = new LoadHoursPagePresenter(
      this.loadHoursPageViewModel,
    );
    this.loadHoursPageInteractor = new LoadHoursPageInteractor(
      this.loadHoursPageDAO,
      this.loadHoursPageOutputBoundary,
    );
    this.loadHoursPageController = new LoadHoursPageController(
      this.loadHoursPageInteractor,
    );

    this.checkHoursDAO = new HoursDataAccessObject();
    this.checkHoursOutputBoundary = new CheckHoursPresenter(
      this.checkHoursViewModel,
    );
    this.checkHoursInteractor = new CheckHoursInteractor(
      this.checkHoursDAO,
      this.checkHoursOutputBoundary,
    );
    this.checkHoursController = new CheckHoursController(
      this.checkHoursInteractor,
    );

    return (
      <HoursPage
        loadHoursPageController={this.loadHoursPageController}
        loadHoursPageViewModel={this.loadHoursPageViewModel}
        checkHoursController={this.checkHoursController}
        checkHoursViewModel={this.checkHoursViewModel}
      />
    );
  }

  makeGroupchatPage(): ReactElement {
    this.loadCreateGroupchatPageDAO = new ChatsDataAccessObject();
    this.loadCreateGroupchatPageOutputBoundary =
      new LoadCreateGroupchatPagePresenter(
        this.loadCreateGroupchatPageViewModel,
      );
    this.loadCreateGroupchatPageInteractor =
      new LoadCreateGroupchatPageInteractor(
        this.loadCreateGroupchatPageDAO,
        this.loadCreateGroupchatPageOutputBoundary,
      );
    this.loadCreateGroupchatPageController =
      new LoadCreateGroupchatPageController(
        this.loadCreateGroupchatPageInteractor,
      );

    if (
      this.chatExistsController === null ||
      this.createChatController === null ||
      this.loadCreateGroupchatPageController === null
    ) {
      throw new Error("Chat controllers are not initialized");
    }

    return (
      <CreateGroupChatView
        loadController={this.loadCreateGroupchatPageController}
        loadViewModel={this.loadCreateGroupchatPageViewModel}
        createController={this.createChatController}
        createViewModel={this.createChatViewModel}
      />
    );
  }
  makeCreateChatPage(): ReactElement {
    this.createChatDAO = new ChatsDataAccessObject();
    this.createChatOutputBoundary = new CreateChatPresenter(
      this.createChatViewModel,
      this.loadCreateChatPageViewModel,
      this.loadCreateGroupchatPageViewModel,
    );
    this.createChatInteractor = new CreateChatInteractor(
      this.createChatDAO,
      this.createChatOutputBoundary,
    );
    this.createChatController = new CreateChatController(
      this.createChatInteractor,
    );

    this.chatExistsDAO = new ChatsDataAccessObject();
    this.chatExistsOutputBoundary = new ChatExistsPresenter(
      this.chatExistsViewModel,
    );
    this.chatExistsInteractor = new ChatExistsInteractor(
      this.chatExistsDAO,
      this.chatExistsOutputBoundary,
    );
    this.chatExistsController = new ChatExistsController(
      this.chatExistsInteractor,
    );

    this.loadCreateChatPageDAO = new ChatsDataAccessObject();
    this.loadCreateChatPageOutputBoundary = new LoadCreateChatPagePresenter(
      this.loadCreateChatPageViewModel,
    );
    this.loadCreateChatPageInteractor = new LoadCreateChatPageInteractor(
      this.loadCreateChatPageDAO,
      this.loadCreateChatPageOutputBoundary,
    );
    this.loadCreateChatPageController = new LoadCreateChatPageController(
      this.loadCreateChatPageInteractor,
    );

    return (
      <CreateChatView
        chatExistsController={this.chatExistsController}
        chatExistsViewModel={this.chatExistsViewModel}
        createChatController={this.createChatController}
        createChatViewModel={this.createChatViewModel}
        controller={this.loadCreateChatPageController}
        viewModel={this.loadCreateChatPageViewModel}
      />
    );
  }

  makeCreateShift(): CreateShiftController {
    this.createShiftOuptutBoundary = new CreateShiftPresenter(
      this.loadingMainPageViewModel,
      this.loadCreateShiftPageViewModel,
    );
    this.createShiftDAO = new BusinessShiftsRAMDisk();
    this.createShiftInteractor = new CreateShiftInteractor(
      this.createShiftDAO,
      this.createShiftOuptutBoundary,
    );
    this.createShiftController = new CreateShiftController(
      this.createShiftInteractor,
    );

    return this.createShiftController;
  }

  async makeCreateShiftPage() {
    this.loadCreateShiftPageOutputBoundary = new LoadCreateShiftPagePresenter(
      this.loadCreateShiftPageViewModel,
    );
    this.loadCreateShiftPageDAO = new MembersDataAccessObject();
    this.loadCreateShiftPageInteractor = new LoadCreateShiftPageInteractor(
      this.loadCreateShiftPageDAO,
      this.loadCreateShiftPageOutputBoundary,
    );
    this.loadCreateShiftPageController = new LoadCreateShiftPageController(
      this.loadCreateShiftPageInteractor,
    );

    const createShiftFunction = this.makeCreateShift();

    const buisness =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (!buisness) throw new Error("You don't have default buisness");

    return (
      <CreateShiftView
        controller={this.loadCreateShiftPageController}
        viewModel={this.loadCreateShiftPageViewModel}
        businessID={buisness.id}
        onCreateShift={async (collectedValues: {
          startTime: Date | null;
          endTime: Date | null;
          address: string;
          description: string;
          users: User[];
          businessID: string;
        }) => {
          createShiftFunction.createShift(collectedValues);
        }}
      />
    );
  }

  startupSync(): StartupSync {
    return new StartupSync();
  }

  makeBusinessSubscribe() {
    this.newBusinessDAO = new BussinessDataAccessObject();
    this.newBusinessOutputBoundary = new NewBusinessPresenter(
      this.loadProfilePageViewmodel,
      this.loadingMainPageViewModel,
    );
    this.newBusinessInteractor = new NewBusinessInteractor(
      this.newBusinessDAO,
      this.newBusinessOutputBoundary,
    );
    this.newBusinessController = new NewBusinessController(
      this.newBusinessInteractor,
    );

    this.newBusinesRequestDAO = new BussinessDataAccessObject();
    this.newBusinessRequestOutputBoundary = new NewBusinessRequestPresenter(
      this.loadProfilePageViewmodel,
      this.loadingMainPageViewModel,
    );
    this.newBusinessRequestInteractor = new NewBusinessRequestInteractor(
      this.newBusinesRequestDAO,
      this.newBusinessRequestOutputBoundary,
    );
    this.newBusinessRequestController = new NewBusinessRequestController(
      this.newBusinessRequestInteractor,
    );

    return new BusinessDataBaseSubscribe({
      controllerBusiness: this.newBusinessController,
      controllerBusinessRequest: this.newBusinessRequestController,
    });
  }

  makeProfiePage(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadProfilePageDAO = new ProfileDAO();
    this.loadProfilePageOutputBoundary = new LoadProfilePagePresenter(
      this.loadProfilePageViewmodel,
    );
    this.laodProfilePageInteractor = new LoadProfilePageInteractor(
      this.loadProfilePageDAO,
      this.loadProfilePageOutputBoundary,
    );
    this.loadProfilePageController = new LoadProfilePageController(
      this.laodProfilePageInteractor,
    );

    return (
      <ProfileView
        controller={this.loadProfilePageController}
        viewModel={this.loadProfilePageViewmodel}
      />
    );
  }

  async makeMemberSubscribe() {
    this.newMemberDAO = new MembersDataAccessObject();
    this.newMemberOutputBoundary = new NewMemberPresenter(
      this.loadMembersPageViewModel,
    );
    this.newMemberInteractor = new NewMemberInteractor(
      this.newMemberDAO,
      this.newMemberOutputBoundary,
    );
    this.newMemberController = new NewMemberController(
      this.newMemberInteractor,
    );

    const business =
      await new BusinessRAMDisk().getMostRecentlyCheckedInBusiness();

    if (business === null) return;

    const businessID = business.id;

    return new MemberDataBaseSubscribe({
      businessID: businessID,
      controller: this.newMemberController,
    });
  }

  makeMembersPage(showScreen: (screen: ReactElement) => void): ReactElement {
    this.loadMembersPageOutputBoundart = new LoadMembersPagePresenter(
      this.loadMembersPageViewModel,
    );
    this.loadMembersPageDAO = new MembersDataAccessObject();
    this.loadMembersPageInteractor = new LoadMembersPageInteractor(
      this.loadMembersPageDAO,
      this.loadMembersPageOutputBoundart,
    );
    this.loadMembersPageController = new LoadMembersPageController(
      this.loadMembersPageInteractor,
    );

    return (
      <MembersView
        viewModel={this.loadMembersPageViewModel}
        controller={this.loadMembersPageController}
        addMemberController={this.makeAddMember()}
        scrollMembersController={this.makeScrollMembers()}
      />
    );
  }

  makeModulePage = async (
    moduleID: string,
    trainingID: string,
  ): Promise<ReactElement> => {
    const module = await new ModuleRAMDisk().getModuleByID(
      moduleID,
      trainingID,
    );

    if (module === undefined) return <NoAccessView />;

    return <ModulePage module={module} />;
  };

  makeTrainingPage = async (trainingID: string): Promise<ReactElement> => {
    const viewModel = new LoadTrainingPageViewModel();

    this.loadTrainingPageViewModel.set(trainingID, viewModel);

    this.loadTrainingPageDAO = new TrainingsDataAccessObject();
    this.loadTrainingPageOutputBoundary = new LoadTrainingPagePresenter(
      viewModel,
    );
    this.loadTrainingPageInteractor = new LoadTrainingPageInteractor(
      this.loadTrainingPageDAO,
      this.loadTrainingPageOutputBoundary,
    );
    this.loadTrainingPageController = new LoadTrainingPageController(
      this.loadTrainingPageInteractor,
    );

    const training = await new TrainingsRAMDisk().getTrainingByID(trainingID);

    if (training === undefined) {
      return <NoAccessView />;
    }

    return (
      <TrainingPage
        controller={this.loadTrainingPageController}
        viewModel={viewModel}
        training={training}
      />
    );
  };

  makeNewModuleSubscribe() {
    this.newModuleOutputBoundary = new NewModulePresenter(
      this.loadTrainingPageViewModel,
    );
    this.newModuleDAO = new TrainingsDataAccessObject();
    this.newModuleInteractor = new NewModuleInteractor(
      this.newModuleDAO,
      this.newModuleOutputBoundary,
    );
    this.newModuleController = new NewModuleController(
      this.newModuleInteractor,
    );

    return new ModuleDataBaseSubscribe({
      controller: this.newModuleController,
    });
  }

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

  makeTrainingsPage(showScreen: (screen: ReactElement) => void): ReactElement {
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
      <TrainingsPage
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
        scrollMessagesController={this.makeScrollMessages(chat_id)}
      />
    );
  };

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
        activeIndex={this.activeIndex}
        pages={[
          this.makeMainPageView(showScreen),
          this.makeMessagesPage(showScreen),
          this.makeTrainingsPage(showScreen),
          this.makeHoursPage(showScreen),
          this.makeMembersPage(showScreen),
          this.makeProfiePage(showScreen),
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
        scrollViewController={this.makeScrollChats()}
      />
    );
  }

  makeNavigationBar(
    onSelect: (index: 0 | 1 | 2 | 3 | 4 | 5) => void,
  ): ReactElement {
    return (
      <NavigationBar
        activeIndex={this.activeIndex}
        onMessagesPress={() => {
          onSelect(1);
        }}
        onMainPress={() => {
          onSelect(0);
        }}
        onTrainingPress={() => {
          onSelect(2);
        }}
        onMembersPress={() => {
          onSelect(4);
        }}
        onProfilePress={() => {
          onSelect(5);
        }}
        onHoursPress={() => {
          onSelect(3);
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

    return new ShiftDataBaseSubscribe({
      controller: this.newShiftController,
      controllerDelete: this.makeDeleteShift(),
      controllerUpdate: this.makeUpdateShift(),
    });
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
        loadShiftsController={this.makeLoadShifts()}
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
