import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.realizarPago();
  }

  realizarPago(): void {
    // URL de prueba de Transbank
    const transbankURL = 'https://webpay3gint.transbank.cl/webpayserver/initTransaction';

    // Redirigir al usuario a Transbank
    window.location.href = transbankURL;
  }
}
