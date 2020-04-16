import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[AuthGuard],

      },
      // {
      //   path: 'ventas',
      //   loadChildren: () =>
      //     import('./ventas/ventas.module').then(m => m.VentasModule)
      // },
      {
        path: 'settings-api',
        loadChildren: () => import('./setting-api/setting-api.module').then(m => m.SettingApiModule),
        canActivate:[AuthGuard],

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AdminRoutingModule {}
