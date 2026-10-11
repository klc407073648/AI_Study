import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';

/**
 * 用户功能模块路由配置
 */
const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: { title: '用户列表' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }



